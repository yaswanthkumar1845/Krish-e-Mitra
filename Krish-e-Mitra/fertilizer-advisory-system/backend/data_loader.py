import pandas as pd
from sqlalchemy.orm import Session
from database import SoilData, FarmerRecord, init_db, SessionLocal
from datetime import datetime
import os

def load_soil_data(db: Session):
    """Load NTR soil data from Excel file into database"""
    print("Loading NTR soil data...")
    
    # Check if data already loaded
    if db.query(SoilData).count() > 0:
        print("Soil data already loaded. Skipping...")
        return
    
    # Read Excel file
    file_path = os.path.join(os.path.dirname(__file__), "..", "datasets", "ntr-soil.xls")
    df = pd.read_excel(file_path)
    
    # Clean column names (remove the ,C,10 and ,C,254 suffixes)
    df.columns = [col.split(',')[0] for col in df.columns]
    
    # Insert data
    for _, row in df.iterrows():
        soil_record = SoilData(
            code=int(row['Code']),
            depth=str(row['Depth']),
            drainage=str(row['Drinage']),  # Note: typo in original data
            texture=str(row['Texture']),
            slope=str(row['Slope']),
            temperature=str(row['Temperatur']),  # Note: typo in original data
            hsg=str(row['HSG']),
            soil_taxonomy=str(row['SoilTaxono']),
            landform=str(row['Landform'])
        )
        db.add(soil_record)
    
    db.commit()
    print(f"Loaded {df.shape[0]} soil records")

def load_farmer_records(db: Session):
    """Load NTR-7 mandals farmer data from Excel file into database"""
    print("Loading NTR-7 mandals farmer data...")
    
    # Check if data already loaded
    if db.query(FarmerRecord).count() > 0:
        print("Farmer records already loaded. Skipping...")
        return
    
    # Read Excel file
    file_path = os.path.join(os.path.dirname(__file__), "..", "datasets", "NTR-7 mandals e panta and SHC sample data.xlsx")
    df = pd.read_excel(file_path)
    
    # Clean column names (remove trailing spaces)
    df.columns = [col.strip() for col in df.columns]
    
    # Insert data
    for _, row in df.iterrows():
        # Handle date parsing
        try:
            sowing_date = pd.to_datetime(row['Date of Sowing'])
        except:
            sowing_date = None
        
        farmer_record = FarmerRecord(
            booking_id=int(row['Booking-id']) if pd.notna(row['Booking-id']) else None,
            district=str(row['District']) if pd.notna(row['District']) else None,
            mandal=str(row['Mandal']) if pd.notna(row['Mandal']) else None,
            village=str(row['Village']) if pd.notna(row['Village']) else None,
            crop_name=str(row['Crop Name']) if pd.notna(row['Crop Name']) else None,
            variety=str(row['Variety']) if pd.notna(row['Variety']) else None,
            area_sown=float(row['Area Sown']) if pd.notna(row['Area Sown']) else None,
            date_of_sowing=sowing_date,
            crop_nature=str(row['Crop Nature']) if pd.notna(row['Crop Nature']) else None,
            irrigation_source=str(row['Irrigation Source']) if pd.notna(row['Irrigation Source']) else None,
            method_of_irrigation=str(row['Method of Irrigation']) if pd.notna(row['Method of Irrigation']) else None,
            farming_type=str(row['Farming Type']) if pd.notna(row['Farming Type']) else None
        )
        db.add(farmer_record)
    
    db.commit()
    print(f"Loaded {df.shape[0]} farmer records")

def initialize_database():
    """Initialize database and load all data"""
    print("Initializing database...")
    
    # Create tables
    init_db()
    
    # Load data
    db = SessionLocal()
    try:
        load_soil_data(db)
        load_farmer_records(db)
        print("Database initialization complete!")
    except Exception as e:
        print(f"Error loading data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    initialize_database()
