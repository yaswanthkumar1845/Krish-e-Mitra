from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# Database setup
DATABASE_URL = "sqlite:///./fertilizer_advisory.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class Farmer(Base):
    __tablename__ = "farmers"
    
    id = Column(Integer, primary_key=True, index=True)
    mobile = Column(String, unique=True, index=True)
    name = Column(String)
    district = Column(String)
    mandal = Column(String)
    language_preference = Column(String, default="en")  # en or te
    created_at = Column(DateTime, default=datetime.utcnow)
    
    fields = relationship("Field", back_populates="farmer")
    recommendations = relationship("Recommendation", back_populates="farmer")

class Field(Base):
    __tablename__ = "fields"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    location = Column(String)
    crop_type = Column(String)
    variety = Column(String)
    sowing_date = Column(DateTime)
    area_sown = Column(Float)  # in acres
    created_at = Column(DateTime, default=datetime.utcnow)
    
    farmer = relationship("Farmer", back_populates="fields")
    recommendations = relationship("Recommendation", back_populates="field")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    field_id = Column(Integer, ForeignKey("fields.id"))
    recommendation_json = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    
    farmer = relationship("Farmer", back_populates="recommendations")
    field = relationship("Field", back_populates="recommendations")

class SoilData(Base):
    __tablename__ = "soil_data"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(Integer)
    depth = Column(String)
    drainage = Column(String)
    texture = Column(String)
    slope = Column(String)
    temperature = Column(String)
    hsg = Column(String)
    soil_taxonomy = Column(String)
    landform = Column(String)

class FarmerRecord(Base):
    __tablename__ = "farmer_records"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer)
    district = Column(String)
    mandal = Column(String)
    village = Column(String)
    crop_name = Column(String)
    variety = Column(String)
    area_sown = Column(Float)
    date_of_sowing = Column(DateTime)
    crop_nature = Column(String)
    irrigation_source = Column(String)
    method_of_irrigation = Column(String)
    farming_type = Column(String)

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
