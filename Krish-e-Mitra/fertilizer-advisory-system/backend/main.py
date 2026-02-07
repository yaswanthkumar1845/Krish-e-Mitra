from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import json

from database import get_db, init_db, Farmer, Field, Recommendation, FarmerRecord
from models import (
    FarmerRegistration, LoginRequest, RecommendationRequest,
    FarmerResponse, LoginResponse, RecommendationResponse,
    CropInfo, DistrictInfo, MandalInfo, WeatherData
)
from rules_engine import calculate_fertilizer_recommendation, get_available_crops
from data_loader import initialize_database
from weather_service import get_current_weather, get_weather_forecast

# Initialize FastAPI app
app = FastAPI(
    title="Krish-e-Mitra API",
    description="AI-Enabled Precision Fertilizer Advisory System for Indian Farmers",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    print("Starting up...")
    init_db()
    # Load data if not already loaded
    try:
        initialize_database()
    except Exception as e:
        print(f"Database already initialized or error: {e}")

@app.get("/")
async def root():
    return {
        "message": "Welcome to Fertilizer Advisory System API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.post("/api/register", response_model=FarmerResponse)
async def register_farmer(farmer_data: FarmerRegistration, db: Session = Depends(get_db)):
    """Register a new farmer"""
    
    # Check if farmer already exists
    existing_farmer = db.query(Farmer).filter(Farmer.mobile == farmer_data.mobile).first()
    if existing_farmer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Farmer with this mobile number already registered"
        )
    
    # Create new farmer
    new_farmer = Farmer(
        mobile=farmer_data.mobile,
        name=farmer_data.name,
        district=farmer_data.district,
        mandal=farmer_data.mandal,
        language_preference=farmer_data.language_preference
    )
    
    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)
    
    return new_farmer

@app.post("/api/login", response_model=LoginResponse)
async def login_farmer(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login with OTP verification (dev OTP: 123456)"""
    
    # Check OTP (hardcoded for development)
    if login_data.otp != "123456":
        return LoginResponse(
            success=False,
            message="Invalid OTP",
            farmer=None
        )
    
    # Find farmer
    farmer = db.query(Farmer).filter(Farmer.mobile == login_data.mobile).first()
    
    if not farmer:
        return LoginResponse(
            success=False,
            message="Farmer not registered. Please register first.",
            farmer=None
        )
    
    return LoginResponse(
        success=True,
        message="Login successful",
        farmer=FarmerResponse.from_orm(farmer)
    )

@app.post("/api/recommendation", response_model=RecommendationResponse)
async def get_recommendation(
    req: RecommendationRequest,
    farmer_mobile: str,
    db: Session = Depends(get_db)
):
    """Generate fertilizer recommendation"""
    
    # Find farmer
    farmer = db.query(Farmer).filter(Farmer.mobile == farmer_mobile).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found"
        )
    
    # Parse sowing date
    try:
        sowing_date = datetime.strptime(req.sowing_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    
    # Create or update field record
    field = Field(
        farmer_id=farmer.id,
        location=f"{req.mandal}, {req.district}",
        crop_type=req.crop_name,
        variety=req.variety,
        sowing_date=sowing_date,
        area_sown=req.area_sown
    )
    db.add(field)
    db.commit()
    db.refresh(field)
    
    # Calculate recommendation
    recommendation_data = calculate_fertilizer_recommendation(
        crop_name=req.crop_name,
        sowing_date=sowing_date,
        district=req.district,
        mandal=req.mandal,
        area_sown=req.area_sown,
        db=db,
        variety=req.variety
    )
    
    # Save recommendation
    recommendation_record = Recommendation(
        farmer_id=farmer.id,
        field_id=field.id,
        recommendation_json=json.dumps(recommendation_data, ensure_ascii=False)
    )
    db.add(recommendation_record)
    db.commit()
    
    return RecommendationResponse(**recommendation_data)

@app.get("/api/history")
async def get_history(farmer_mobile: str, db: Session = Depends(get_db)):
    """Get farmer's recommendation history"""
    
    # Find farmer
    farmer = db.query(Farmer).filter(Farmer.mobile == farmer_mobile).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer not found"
        )
    
    # Get recommendations
    recommendations = db.query(Recommendation).filter(
        Recommendation.farmer_id == farmer.id
    ).order_by(Recommendation.created_at.desc()).limit(10).all()
    
    history = []
    for rec in recommendations:
        rec_data = json.loads(rec.recommendation_json)
        rec_data['created_at'] = rec.created_at.strftime("%Y-%m-%d %H:%M:%S")
        history.append(rec_data)
    
    return {"history": history}

@app.get("/api/crops", response_model=List[CropInfo])
async def get_crops(db: Session = Depends(get_db)):
    """Get list of available crops"""
    return get_available_crops(db)

@app.get("/api/districts", response_model=List[DistrictInfo])
async def get_districts(db: Session = Depends(get_db)):
    """Get list of districts"""
    districts = db.query(FarmerRecord.district).distinct().all()
    return [DistrictInfo(name=d[0]) for d in districts if d[0]]

@app.get("/api/mandals", response_model=List[MandalInfo])
async def get_mandals(district: str = None, db: Session = Depends(get_db)):
    """Get list of mandals, optionally filtered by district"""
    query = db.query(FarmerRecord.mandal).distinct()
    
    if district:
        query = query.filter(FarmerRecord.district == district)
    
    mandals = query.all()
    return [MandalInfo(name=m[0]) for m in mandals if m[0]]

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/weather", response_model=WeatherData)
async def get_weather(district: str, mandal: str):
    """Get current weather for a location"""
    try:
        weather_data = get_current_weather(district, mandal)
        return weather_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching weather data: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
