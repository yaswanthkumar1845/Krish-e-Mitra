import { useState } from 'react';
import { getTranslation } from '../i18n/translations';
import { loginFarmer, registerFarmer } from '../utils/api';

export default function Login({ onLoginSuccess }) {
    const [language, setLanguage] = useState('en');
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'

    // Login form state
    const [loginMobile, setLoginMobile] = useState('');
    const [loginOtp, setLoginOtp] = useState('');

    // Signup form state
    const [signupMobile, setSignupMobile] = useState('');
    const [signupOtp, setSignupOtp] = useState('');
    const [name, setName] = useState('');
    const [district, setDistrict] = useState('');
    const [mandal, setMandal] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const t = (key) => getTranslation(key, language);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loginMobile.length !== 10) {
            setError(t('invalidMobile'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await loginFarmer(loginMobile, loginOtp);
            if (response.success) {
                localStorage.setItem('farmer', JSON.stringify(response.farmer));
                localStorage.setItem('language', language);
                onLoginSuccess(response.farmer);
            } else {
                setError(response.message || t('loginError'));
            }
        } catch (err) {
            setError(t('loginError'));
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (signupMobile.length !== 10) {
            setError(t('invalidMobile'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            await registerFarmer({
                mobile: signupMobile,
                name,
                district,
                mandal,
                language_preference: language
            });

            // Auto-login after registration
            const response = await loginFarmer(signupMobile, signupOtp);
            if (response.success) {
                localStorage.setItem('farmer', JSON.stringify(response.farmer));
                localStorage.setItem('language', language);
                onLoginSuccess(response.farmer);
            } else {
                setError(response.message || t('loginError'));
            }
        } catch (err) {
            setError(t('registrationError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
            <div className="card max-w-md w-full">
                {/* Language Toggle */}
                <div className="flex justify-end gap-3 mb-4">
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
                        className="text-sm text-primary-600 hover:text-primary-700 font-semibold dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        {language === 'en' ? 'తెలుగు' : 'English'}
                    </button>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-4xl mb-2">🌾</div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('appName')}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{t('welcome')}</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => {
                            setActiveTab('login');
                            setError('');
                        }}
                        className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition-all ${activeTab === 'login'
                                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                    >
                        {t('loginTab')}
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('signup');
                            setError('');
                        }}
                        className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition-all ${activeTab === 'signup'
                                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                    >
                        {t('signupTab')}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                {activeTab === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('mobileNumber')}
                            </label>
                            <input
                                type="tel"
                                value={loginMobile}
                                onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder={t('enterMobile')}
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('otp')}
                            </label>
                            <input
                                type="text"
                                value={loginOtp}
                                onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder={t('enterOTP')}
                                className="input-field"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">{t('devOtp')}</p>
                        </div>
                        <button
                            type="submit"
                            className="btn-primary w-full bg-gray-900 hover:bg-gray-800 text-white"
                            disabled={loading}
                        >
                            {loading ? t('loading') : t('login')}
                        </button>

                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                            {t('dontHaveAccount')}
                            <button
                                type="button"
                                onClick={() => setActiveTab('signup')}
                                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline ml-1"
                            >
                                {t('signUpHere')}
                            </button>
                        </p>
                    </form>
                )}

                {/* Signup Form */}
                {activeTab === 'signup' && (
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('name')}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('enterName')}
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('mobileNumber')}
                            </label>
                            <input
                                type="tel"
                                value={signupMobile}
                                onChange={(e) => setSignupMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder={t('enterMobile')}
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('district')}
                            </label>
                            <input
                                type="text"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                placeholder={t('selectDistrict')}
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('mandal')}
                            </label>
                            <input
                                type="text"
                                value={mandal}
                                onChange={(e) => setMandal(e.target.value)}
                                placeholder={t('selectMandal')}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
                                {t('otp')}
                            </label>
                            <input
                                type="text"
                                value={signupOtp}
                                onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder={t('enterOTP')}
                                className="input-field"
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">{t('devOtp')}</p>
                        </div>
                        <button
                            type="submit"
                            className="btn-primary w-full bg-gray-900 hover:bg-gray-800 text-white"
                            disabled={loading}
                        >
                            {loading ? t('loading') : t('createAccount')}
                        </button>

                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                            {t('alreadyHaveAccount')}
                            <button
                                type="button"
                                onClick={() => setActiveTab('login')}
                                className="text-primary-600 dark:text-primary-400 font-semibold hover:underline ml-1"
                            >
                                {t('loginHere')}
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
