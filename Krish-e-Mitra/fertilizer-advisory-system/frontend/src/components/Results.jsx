import { useState } from 'react';
import { getTranslation } from '../i18n/translations';
import FertilizerSchedule from './FertilizerSchedule';


export default function Results({ recommendation, onBack }) {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    const t = (key) => getTranslation(key, language);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <header className="bg-primary-600 text-white shadow-lg print:hidden sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="text-2xl">🌾</div>
                            <h1 className="text-2xl font-bold">{t('recommendation')}</h1>
                        </div>
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
                            className="text-sm bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-lg transition-colors font-medium border border-primary-600"
                        >
                            {language === 'en' ? 'తెలుగు' : 'English'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - Top to Bottom Layout */}
            <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">

                {/* Crop Info Card */}
                <div className="card bg-white dark:bg-gray-800 shadow-md">
                    <div className="flex justify-between items-start mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                                {language === 'en' ? recommendation.english_name : recommendation.crop}
                            </h2>
                            {recommendation.variety && (
                                <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">{recommendation.variety}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-500 uppercase tracking-wide font-semibold">{t('district')}</p>
                            <p className="text-gray-800 dark:text-gray-200 font-medium mb-1">{recommendation.district}, {recommendation.mandal}</p>
                            <p className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs px-2 py-1 rounded-full font-bold">
                                {recommendation.area_sown} {t('acres')}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase">{t('cropStage')}</p>
                            <p className="font-bold text-gray-800 dark:text-gray-100">{recommendation.current_stage}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase">{t('daysAfterSowing')}</p>
                            <p className="font-bold text-gray-800 dark:text-gray-100">{recommendation.days_after_sowing}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase">{t('sowingDate')}</p>
                            <p className="font-bold text-gray-800 dark:text-gray-100">{recommendation.sowing_date}</p>
                        </div>
                    </div>
                </div>

                {/* Weather Context & Advice */}
                {recommendation.weather && (
                    <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                        <div className="flex justify-between items-center mb-0">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">
                                    {recommendation.weather.main === 'Rain' ? '🌧️' :
                                        recommendation.weather.main === 'Clouds' ? '☁️' :
                                            recommendation.weather.main === 'Clear' ? '☀️' : '🌤️'}
                                </span>
                                <div>
                                    <h3 className="text-lg font-bold">{t('currentWeather')}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-bold">{recommendation.weather.temperature.toFixed(0)}°C</p>
                                        <p className="capitalize opacity-90 text-sm">{recommendation.weather.description}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right text-sm opacity-90">
                                <p>{t('humidity')}: {recommendation.weather.humidity}%</p>
                                <p>{t('rainfall')}: {recommendation.weather.rain_3h > 0 ? `${recommendation.weather.rain_3h}mm` : '0mm'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {recommendation.weather_analysis && (
                    <div className={`card border-l-4 ${recommendation.weather_analysis.can_apply
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                        : 'border-red-500 bg-red-50 dark:bg-red-900/10'
                        }`}>
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">
                                {recommendation.weather_analysis.can_apply ? '✅' : '⛔'}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                                    {t('weatherAdvice')}
                                </h3>
                                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {recommendation.weather_analysis.timing_advice}
                                </p>
                                {recommendation.weather_analysis.weather_notes && recommendation.weather_analysis.weather_notes.length > 0 && (
                                    <ul className="space-y-1">
                                        {recommendation.weather_analysis.weather_notes.map((note, index) => (
                                            <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                                                <span className="mr-2 text-primary-500">•</span>
                                                <span>{note}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Stage-Based Fertilizer Schedule */}
                {recommendation.stage_schedule && (
                    <FertilizerSchedule
                        schedule={recommendation.stage_schedule}
                        language={language}
                    />
                )}

                {/* Fertilizers Table */}
                <div className="card overflow-hidden">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 px-2">{t('fertilizers')}</h3>
                    <div className="overflow-x-auto -mx-6 md:mx-0">
                        <table className="w-full">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{t('fertilizerType')}</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">{t('amount')}</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">{t('amountPerAcre')}</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{t('timing')}</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">{t('cost')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {recommendation.fertilizers.map((fertilizer, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-gray-800 dark:text-gray-100">{fertilizer.type}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{fertilizer.telugu_name}</div>
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-200">{fertilizer.amount_kg} <span className="text-xs text-gray-500">{t('kg')}</span></td>
                                        <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-200">{fertilizer.amount_per_acre} <span className="text-xs text-gray-500">{t('kg')}</span></td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{fertilizer.timing}</td>
                                        <td className="px-4 py-3 text-right font-medium text-primary-600">₹{fertilizer.cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 dark:bg-gray-800 font-semibold">
                                <tr>
                                    <td colSpan="4" className="px-4 py-3 text-right text-gray-800 dark:text-gray-100">{t('totalCost')}:</td>
                                    <td className="px-4 py-3 text-right text-primary-600 text-lg">₹{recommendation.total_cost}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Expected Yield */}
                <div className="card bg-primary-50 dark:bg-primary-900/10 border-l-4 border-primary-500 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-2">
                            📈 {t('expectedYield')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Estimated increase with recommended application</p>
                    </div>
                    <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">
                        {recommendation.expected_yield_increase}
                    </p>
                </div>

                {/* Organic & Alternative Options */}
                {recommendation.organic_recommendations && (
                    <div className="card border-l-4 border-green-500">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <span>🌿</span> {t('organicOptions')}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {recommendation.organic_recommendations.manures.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-green-700 dark:text-green-400 mb-2 uppercase text-sm border-b border-green-200 dark:border-green-800 pb-1">{t('manures')}</h4>
                                    <ul className="space-y-3">
                                        {recommendation.organic_recommendations.manures.map((item, idx) => (
                                            <li key={idx} className="bg-green-50 dark:bg-green-900/10 p-3 rounded-md">
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{language === 'en' ? item.name : item.telugu_name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.rate_per_acre}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {recommendation.organic_recommendations.bio_fertilizers.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2 uppercase text-sm border-b border-blue-200 dark:border-blue-800 pb-1">{t('bioFertilizers')}</h4>
                                    <ul className="space-y-3">
                                        {recommendation.organic_recommendations.bio_fertilizers.map((item, idx) => (
                                            <li key={idx} className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md">
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{language === 'en' ? item.name : item.telugu_name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.rate_per_acre}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        {recommendation.organic_recommendations.green_manures.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-bold text-yellow-700 dark:text-yellow-400 mb-2 uppercase text-sm border-b border-yellow-200 dark:border-yellow-800 pb-1">{t('greenManures')}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {recommendation.organic_recommendations.green_manures.map((item, idx) => (
                                        <div key={idx} className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-md">
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">{language === 'en' ? item.name : item.telugu_name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.season}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Notes */}
                {recommendation.notes && recommendation.notes.length > 0 && (
                    <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">⚠️ {t('notes')}</h3>
                        <ul className="space-y-2">
                            {recommendation.notes.map((note, index) => (
                                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                                    <span className="mr-2 text-yellow-500">•</span>
                                    <span>{note}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Where to Buy Section */}
                <div className="card bg-white dark:bg-gray-800 shadow-md border-t-4 border-indigo-500">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                        🛒 {t('whereToBuy')}
                    </h3>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Local Shops */}
                        <div>
                            <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                🏪 {t('nearbyShops')}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {language === 'en' ? 'Find authorized dealers and fertilizer shops near your location.' : 'మీ ప్రాంతంలోని అధీకృత డీలర్లు మరియు ఎరువుల దుకాణాలను కనుగొనండి.'}
                            </p>
                            <a
                                href={`https://www.google.com/maps/search/fertilizer+shops+near+${recommendation.mandal},+${recommendation.district}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full"
                            >
                                <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-blue-300">
                                    📍 {t('findShops')}
                                </button>
                            </a>
                        </div>

                        {/* Online Stores */}
                        <div>
                            <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                🌐 {t('onlineStores')}
                            </h4>
                            <div className="space-y-3">
                                <a href="https://www.iffcobazar.in/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">IFFCO Bazar</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:underline">{t('shopNow')} ➔</span>
                                </a>
                                <a href="https://www.bighaat.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">BigHaat</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:underline">{t('shopNow')} ➔</span>
                                </a>
                                <a href="https://www.agrostar.in/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">AgroStar</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:underline">{t('shopNow')} ➔</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 print:hidden">
                    <button onClick={onBack} className="flex-1 btn-secondary flex justify-center items-center gap-2 py-3">
                        ⬅️ {t('back')}
                    </button>
                    <button onClick={handlePrint} className="flex-1 btn-primary flex justify-center items-center gap-2 py-3">
                        🖨️ {t('print')}
                    </button>
                </div>
            </main>
        </div>
    );
}
