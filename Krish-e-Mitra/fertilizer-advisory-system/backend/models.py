from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Request Models
class FarmerRegistration(BaseModel):
    mobile: str = Field(..., min_length=10, max_length=10)
    name: str
    district: str
    mandal: Optional[str] = None
    language_preference: str = "en"  # en or te

class LoginRequest(BaseModel):
    mobile: str = Field(..., min_length=10, max_length=10)
    otp: str = Field(..., min_length=6, max_length=6)

class RecommendationRequest(BaseModel):
    crop_name: str
    variety: Optional[str] = None
    sowing_date: str  # YYYY-MM-DD format
    district: str
    mandal: str
    area_sown: float = Field(..., gt=0)

# Response Models
class FertilizerDetail(BaseModel):
    type: str
    telugu_name: str
    amount_kg: float
    amount_per_acre: float
    timing: str
    cost: float
    nutrient: str

class WeatherData(BaseModel):
    location: str
    temperature: float
    feels_like: float
    humidity: int
    description: str
    main: str
    icon: str
    wind_speed: float
    clouds: int
    rain_1h: float
    rain_3h: float
    timestamp: str
    is_mock: bool = False

class WeatherForecast(BaseModel):
    date: str
    temp_max: float
    temp_min: float
    description: str
    rain_probability: int
    rain_mm: float

class WeatherAnalysis(BaseModel):
    condition: str  # SUNNY, CLOUDY, RAINY
    can_apply: bool
    timing_advice: str
    weather_notes: List[str]
    temperature: float
    rainfall_3h: float
    rain_expected_24h: bool

# Stage-Based Schedule Models
class StageFertilizer(BaseModel):
    name: str
    name_te: str
    amount_kg: float
    amount_per_acre: float
    nutrient: str
    percentage: str

class FertilizerStage(BaseModel):
    stage_name: str
    stage_name_te: str
    icon: str
    days_after_sowing: int
    duration_days: int
    application_date: str
    application_date_formatted: str
    fertilizers: List[StageFertilizer]
    instructions_en: str
    instructions_te: str

class StageBasedSchedule(BaseModel):
    crop: str
    crop_key: str
    sowing_date: str
    sowing_date_formatted: str
    total_duration_days: int
    area_sown: float
    stages: List[FertilizerStage]
    total_stages: int

class RecommendationResponse(BaseModel):
    crop: str
    english_name: str
    variety: Optional[str]
    area_sown: float
    sowing_date: str
    current_stage: str
    days_after_sowing: int
    stage_description: str
    fertilizers: List[FertilizerDetail]
    total_cost: float
    expected_yield_increase: str
    soil_parameters: dict
    notes: List[str]
    district: str
    mandal: str
    weather: Optional[WeatherData] = None
    weather_analysis: Optional[WeatherAnalysis] = None
    forecast: Optional[List[WeatherForecast]] = None
    stage_schedule: Optional[StageBasedSchedule] = None
    organic_recommendations: Optional[dict] = None

class FarmerResponse(BaseModel):
    id: int
    mobile: str
    name: str
    district: str
    mandal: Optional[str]
    language_preference: str
    
    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    success: bool
    message: str
    farmer: Optional[FarmerResponse] = None

class CropInfo(BaseModel):
    telugu_name: str
    english_name: str

class DistrictInfo(BaseModel):
    name: str

class MandalInfo(BaseModel):
    name: str
