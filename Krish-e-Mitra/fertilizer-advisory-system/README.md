# Krish-e-Mitra: AI-Enabled Precision Fertilizer Advisory System

A complete, functional prototype of **Krish-e-Mitra**, an AI-Enabled Precision Fertilizer Advisory System for Indian farmers using FastAPI backend + React frontend with bilingual support (English/Telugu).

## Features

- 🌾 **Rule-based Fertilizer Recommendations**: Transparent, explainable recommendations based on crop type, growth stage, and soil parameters
- 🌍 **Bilingual Support**: Full English and Telugu interface
- 📱 **OTP Authentication**: Simple mobile-based login (Dev OTP: 123456)
- 📊 **Data Integration**: Integrated with NTR soil data and farmer records
- 🎯 **Localized Advice**: District and mandal-specific recommendations
- 💰 **Cost Analysis**: Detailed fertilizer costs and expected yield increase
- 📜 **History Tracking**: View past recommendations

## Tech Stack

- **Backend**: FastAPI (Python) with SQLite database
- **Frontend**: React.js with Tailwind CSS
- **Deployment**: Docker Compose

## Project Structure

```
fertilizer-advisory-system/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── database.py             # SQLAlchemy models
│   ├── rules_engine.py         # Fertilizer calculation logic
│   ├── data_loader.py          # Load Excel datasets
│   ├── models.py               # Pydantic schemas
│   ├── crop_data.json          # Crop and fertilizer data
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RecommendationForm.jsx
│   │   │   └── Results.jsx
│   │   ├── utils/
│   │   │   └── api.js          # API client
│   │   ├── i18n/
│   │   │   └── translations.js # Bilingual translations
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── Dockerfile
├── datasets/
│   ├── ntr-soil.xls            # NTR soil data (80 records)
│   └── NTR-7 mandals e panta and SHC sample data.xlsx  # Farmer records (105 records)
├── docker-compose.yml
└── README.md
```

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed

### Run the Application

1. **Clone/Navigate to the project directory**:
   ```bash
   cd fertilizer-advisory-system
   ```

2. **Start the application**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

4. **Login**:
   - Enter any 10-digit mobile number
   - Use OTP: **123456** (hardcoded for development)
   - Register if first time, or login if already registered

## Manual Setup (Without Docker)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize database and load data**:
   ```bash
   python data_loader.py
   ```

5. **Run the server**:
   ```bash
   uvicorn main:app --reload
   ```

   Backend will be available at http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

   Frontend will be available at http://localhost:5173 (Vite default)

## API Endpoints

- `POST /api/register` - Register new farmer
- `POST /api/login` - Login with OTP
- `POST /api/recommendation` - Get fertilizer recommendation
- `GET /api/history` - Get recommendation history
- `GET /api/crops` - List available crops
- `GET /api/districts` - List districts
- `GET /api/mandals` - List mandals

## Data Sources

### NTR Soil Data (ntr-soil.xls)
- 80 soil records with parameters: depth, drainage, texture, slope, temperature, soil taxonomy, landform

### NTR-7 Mandals Farmer Data (NTR-7 mandals e panta and SHC sample data.xlsx)
- 105 farmer records from 7 mandals
- Crops: Rice (వరి), Cotton (ప్రత్తి), Chilli (మిరప), Mango (మామిడి), and others
- Districts: NTR
- Mandals: A KONDURU, CHANDARLAPADU, GAMPALAGUDEM, IBRAHIMPATNAM, KANCHIKA CHERLA, TIRUVURU, VEERULLAPADU

## How It Works

1. **User Login**: Farmer logs in with mobile number and OTP
2. **Input Details**: Selects crop, variety, sowing date, location, and area
3. **Calculation**: System calculates:
   - Current crop growth stage based on sowing date
   - Soil nutrient levels from database
   - Required fertilizers (Urea, DAP, MOP) based on deficiency
   - Application timing and amounts
   - Total cost estimation
4. **Results**: Displays detailed recommendation with:
   - Fertilizer types and quantities
   - Application timing
   - Cost breakdown
   - Expected yield increase
   - Important notes

## Fertilizer Calculation Logic

The system uses a rule-based approach:

1. **Crop Stage Determination**:
   - Vegetative: 0-30 days after sowing
   - Flowering: 31-60 days
   - Ripening: 61+ days

2. **Soil Analysis**:
   - Compares soil N, P, K levels against thresholds
   - Identifies nutrient deficiencies

3. **Fertilizer Recommendation**:
   - Calculates required nutrients based on crop stage
   - Recommends appropriate fertilizers (Urea for N, DAP for P, MOP for K)
   - Adjusts quantities based on area sown
   - Provides timing guidance

## Language Support

The application supports:
- **English**: Full interface
- **Telugu (తెలుగు)**: Complete translation including crop names, fertilizer names, and all UI elements

Toggle language using the button in the top-right corner.

## Development Notes

- **OTP**: Hardcoded as `123456` for development
- **Database**: SQLite for prototype (easily upgradeable to PostgreSQL/MySQL)
- **Mock Data**: Weather and NDVI data are mocked for prototype
- **ZREAC Guidelines**: Simplified implementation for prototype

## Future Enhancements

- Real-time weather API integration
- Satellite imagery (NDVI) integration
- SMS notifications for recommendations
- Multi-crop field management
- Seasonal planning and crop rotation advice
- Mobile app (React Native)
- Production-ready authentication (real OTP service)

## License

This is a prototype developed for demonstration purposes.

## Support

For issues or questions, please contact the development team.
