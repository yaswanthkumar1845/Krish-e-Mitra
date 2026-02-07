import { useState, useEffect } from 'react';
import { getTranslation } from '../i18n/translations';
import { getCrops, getDistricts, getMandals, getRecommendation } from '../utils/api';

export default function RecommendationForm({ farmer, onRecommendationReceived, onBack }) {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
    const [loading, setLoading] = useState(false);
    const [crops, setCrops] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [mandals, setMandals] = useState([]);

    const [formData, setFormData] = useState({
        crop_name: '',
        variety: '',
        sowing_date: '',
        district: farmer.district || '',
        mandal: farmer.mandal || '',
        area_sown: ''
    });
    const [error, setError] = useState('');

    const t = (key) => getTranslation(key, language);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (formData.district) {
            loadMandals(formData.district);
        }
    }, [formData.district]);

    const loadData = async () => {
        try {
            const [cropsData, districtsData] = await Promise.all([
                getCrops(),
                getDistricts()
            ]);
            setCrops(cropsData);
            setDistricts(districtsData);
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    };

    const loadMandals = async (district) => {
        try {
            const mandalsData = await getMandals(district);
            setMandals(mandalsData);
        } catch (err) {
            console.error('Failed to load mandals:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const recommendation = await getRecommendation(farmer.mobile, formData);
            onRecommendationReceived(recommendation);
        } catch (err) {
            setError(t('error') + ': ' + (err.message || t('loginError')));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <header className="bg-primary-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">🌾 {t('getRecommendation')}</h1>
                        </div>
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
                            className="text-sm bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-lg"
                        >
                            {language === 'en' ? 'తెలుగు' : 'English'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Form */}
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="card">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Crop Selection */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('cropName')} *
                            </label>
                            <select
                                value={formData.crop_name}
                                onChange={(e) => handleChange('crop_name', e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="">{t('selectCrop')}</option>
                                {crops.map((crop, index) => (
                                    <option key={index} value={crop.telugu_name}>
                                        {language === 'en' ? crop.english_name : crop.telugu_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Variety */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('variety')}
                            </label>
                            <input
                                type="text"
                                value={formData.variety}
                                onChange={(e) => handleChange('variety', e.target.value)}
                                placeholder={t('enterVariety')}
                                className="input-field"
                            />
                        </div>

                        {/* Sowing Date */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('sowingDate')} *
                            </label>
                            <input
                                type="date"
                                value={formData.sowing_date}
                                onChange={(e) => handleChange('sowing_date', e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        {/* District */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('district')} *
                            </label>
                            <select
                                value={formData.district}
                                onChange={(e) => handleChange('district', e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="">{t('selectDistrict')}</option>
                                {districts.map((district, index) => (
                                    <option key={index} value={district.name}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Mandal */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('mandal')} *
                            </label>
                            <select
                                value={formData.mandal}
                                onChange={(e) => handleChange('mandal', e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="">{t('selectMandal')}</option>
                                {mandals.map((mandal, index) => (
                                    <option key={index} value={mandal.name}>
                                        {mandal.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Area Sown */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('areaSown')} *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={formData.area_sown}
                                onChange={(e) => handleChange('area_sown', e.target.value)}
                                placeholder={t('enterArea')}
                                className="input-field"
                                required
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onBack}
                                className="btn-secondary flex-1"
                            >
                                {t('back')}
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex-1"
                                disabled={loading}
                            >
                                {loading ? t('loading') : t('getRecommendation')}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
