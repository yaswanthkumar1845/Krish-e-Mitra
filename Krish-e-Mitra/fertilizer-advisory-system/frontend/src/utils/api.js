import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API functions
export const registerFarmer = async (farmerData) => {
    const response = await api.post('/api/register', farmerData);
    return response.data;
};

export const loginFarmer = async (mobile, otp) => {
    const response = await api.post('/api/login', { mobile, otp });
    return response.data;
};

export const getRecommendation = async (farmerMobile, recommendationData) => {
    const response = await api.post(
        `/api/recommendation?farmer_mobile=${farmerMobile}`,
        recommendationData
    );
    return response.data;
};

export const getHistory = async (farmerMobile) => {
    const response = await api.get(`/api/history?farmer_mobile=${farmerMobile}`);
    return response.data;
};

export const getCrops = async () => {
    const response = await api.get('/api/crops');
    return response.data;
};

export const getDistricts = async () => {
    const response = await api.get('/api/districts');
    return response.data;
};

export const getMandals = async (district = null) => {
    const url = district ? `/api/mandals?district=${district}` : '/api/mandals';
    const response = await api.get(url);
    return response.data;
};

export const getWeather = async (district, mandal) => {
    const response = await api.get(`/api/weather?district=${district}&mandal=${mandal}`);
    return response.data;
};

export default api;
