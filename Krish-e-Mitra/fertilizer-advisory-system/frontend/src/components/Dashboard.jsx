import { useState, useEffect } from 'react';
import { getTranslation } from '../i18n/translations';
import { getHistory, getWeather } from '../utils/api';

export default function Dashboard({ farmer, onNavigate }) {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
    const [history, setHistory] = useState([]);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    const t = (key) => getTranslation(key, language);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [historyData, weatherData] = await Promise.all([
                    getHistory(farmer.mobile),
                    getWeather(farmer.district, farmer.mandal).catch(err => {
                        console.error("Weather fetch failed", err);
                        return null;
                    })
                ]);

                setHistory(historyData.history || []);
                setWeather(weatherData); // Might be null if failed, handle in UI
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [farmer]);

    const handleLogout = () => {
        localStorage.removeItem('farmer');
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <header className="bg-primary-600 text-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                🌾 <span className="hidden md:inline">{t('appName')}</span>
                            </h1>
                        </div>
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={() => onNavigate('profile')}
                                className="text-sm bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-lg transition-colors border border-primary-500 font-medium"
                            >
                                👤 {t('profile')}
                            </button>
                            <button
                                onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
                                className="text-sm bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-lg transition-colors border border-primary-500 font-medium"
                            >
                                {language === 'en' ? 'తెలుగు' : 'English'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-sm bg-red-500/90 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
                            >
                                {t('logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">

                {/* Welcome & Weather Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">

                    {/* Welcome Card - 8 cols */}
                    <div className="md:col-span-7 lg:col-span-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">{t('welcome')}, {farmer.name} 👋</h2>
                            <p className="text-primary-100 text-lg opacity-90">{farmer.district}, {farmer.mandal}</p>

                            <button
                                onClick={() => onNavigate('recommendation')}
                                className="mt-6 bg-gray-900 text-white hover:bg-gray-800 font-bold py-3 px-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
                            >
                                <span className="text-xl">✨</span> {t('getNewRecommendation')}
                            </button>
                        </div>

                        {/* Decorative Circle */}
                        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                    </div>

                    {/* Weather Widget - 4 cols */}
                    <div className="md:col-span-5 lg:col-span-4">
                        {weather ? (
                            <div className="h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-blue-50 uppercase tracking-widest text-xs">{t('currentWeather')}</h3>
                                        <p className="text-4xl font-bold mt-1">{weather.temperature.toFixed(0)}°C</p>
                                        <p className="capitalize font-medium opacity-90">{weather.description}</p>
                                    </div>
                                    <div className="text-5xl drop-shadow-md">
                                        {weather.main === 'Rain' ? '🌧️' :
                                            weather.main === 'Clouds' ? '☁️' :
                                                weather.main === 'Clear' ? '☀️' : '🌤️'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-white/20 rounded-lg p-2 text-center backdrop-blur-sm">
                                        <span className="text-xs uppercase opacity-75">{t('humidity')}</span>
                                        <p className="font-bold">{weather.humidity}%</p>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-2 text-center backdrop-blur-sm">
                                        <span className="text-xs uppercase opacity-75">{t('rainfall')}</span>
                                        <p className="font-bold">{weather.rain_3h > 0 ? `${weather.rain_3h}mm` : '0mm'}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-400">
                                {loading ? t('loading') : t('weather') + ' ' + t('notAvailable')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent History Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('recentRecommendations')}</h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                            {history.length} {t('report')}{history.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : history.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('noRecommendations')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Start by creating your first fertilizer plan.</p>
                            <button
                                onClick={() => onNavigate('recommendation')}
                                className="btn-primary"
                            >
                                {t('getNewRecommendation')}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Card Item */}
                            {history.map((rec, index) => (
                                <div
                                    key={index}
                                    onClick={() => onNavigate('results', rec)}
                                    className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-700 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="text-6xl">📄</span>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                                {rec.crop}
                                            </span>
                                            <span className="text-xs text-gray-400">{rec.created_at?.split(' ')[0]}</span>
                                        </div>

                                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">
                                            {rec.variety || t('notAvailable')}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-10 line-clamp-2">
                                            {rec.district}, {rec.mandal} • {rec.area_sown} {t('acres')}
                                        </p>

                                        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase">{t('totalCost')}</p>
                                                <p className="font-bold text-primary-600 dark:text-primary-400">₹{rec.total_cost}</p>
                                            </div>
                                            <span className="text-primary-500 group-hover:translate-x-1 transition-transform">
                                                ➔
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* New Item Card */}
                            <div
                                onClick={() => onNavigate('recommendation')}
                                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all cursor-pointer min-h-[200px]"
                            >
                                <span className="text-4xl mb-2">+</span>
                                <span className="font-medium">{t('getNewRecommendation')}</span>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
