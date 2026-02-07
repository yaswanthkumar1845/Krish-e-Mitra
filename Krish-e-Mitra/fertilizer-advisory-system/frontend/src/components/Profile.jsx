import { useState } from 'react';
import { getTranslation } from '../i18n/translations';

export default function Profile({ farmer, onBack, onProfileUpdate }) {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Editable fields
    const [editedName, setEditedName] = useState(farmer.name);
    const [editedDistrict, setEditedDistrict] = useState(farmer.district);
    const [editedMandal, setEditedMandal] = useState(farmer.mandal);

    const t = (key) => getTranslation(key, language);

    const handleSave = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Update farmer data in localStorage
            const updatedFarmer = {
                ...farmer,
                name: editedName,
                district: editedDistrict,
                mandal: editedMandal
            };

            localStorage.setItem('farmer', JSON.stringify(updatedFarmer));

            // Call parent callback to update farmer state
            if (onProfileUpdate) {
                onProfileUpdate(updatedFarmer);
            }

            setSuccess(t('profileUpdated'));
            setIsEditing(false);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(t('profileUpdateFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditedName(farmer.name);
        setEditedDistrict(farmer.district);
        setEditedMandal(farmer.mandal);
        setIsEditing(false);
        setError('');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <header className="bg-primary-600 text-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="text-white hover:bg-primary-700 p-2 rounded-lg transition-colors"
                            >
                                ← {t('back')}
                            </button>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                👤 {t('profile')}
                            </h1>
                        </div>
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
                            className="text-sm bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-lg transition-colors border border-primary-500 font-medium"
                        >
                            {language === 'en' ? 'తెలుగు' : 'English'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Profile Header Card */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl mb-6">
                    <div className="flex items-center gap-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                            <span className="text-6xl">👤</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-2">{farmer.name}</h2>
                            <p className="text-primary-100 text-lg">{farmer.mobile}</p>
                            <p className="text-primary-100">{farmer.district}, {farmer.mandal}</p>
                        </div>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                        ✓ {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {/* Profile Information Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            {t('profile')} {t('information')}
                        </h3>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                ✏️ {t('editProfile')}
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                                >
                                    {loading ? t('loading') : `💾 ${t('saveChanges')}`}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                {t('name')}
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className="input-field"
                                />
                            ) : (
                                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                    {farmer.name}
                                </p>
                            )}
                        </div>

                        {/* Mobile Number (Read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                {t('mobileNumber')}
                            </label>
                            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                {farmer.mobile}
                            </p>
                        </div>

                        {/* District */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                {t('district')}
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedDistrict}
                                    onChange={(e) => setEditedDistrict(e.target.value)}
                                    className="input-field"
                                />
                            ) : (
                                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                    {farmer.district}
                                </p>
                            )}
                        </div>

                        {/* Mandal */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                {t('mandal')}
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedMandal}
                                    onChange={(e) => setEditedMandal(e.target.value)}
                                    className="input-field"
                                />
                            ) : (
                                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                    {farmer.mandal || t('notAvailable')}
                                </p>
                            )}
                        </div>

                        {/* Language Preference */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                {t('languagePreference')}
                            </label>
                            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                {farmer.language_preference === 'te' ? 'తెలుగు (Telugu)' : 'English'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back to Dashboard Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={onBack}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
                    >
                        ← {t('back')} {t('dashboard')}
                    </button>
                </div>
            </main>
        </div>
    );
}
