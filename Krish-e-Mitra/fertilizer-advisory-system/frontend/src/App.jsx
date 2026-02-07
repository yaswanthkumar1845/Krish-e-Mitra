import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RecommendationForm from './components/RecommendationForm';
import Results from './components/Results';
import Profile from './components/Profile';
import './index.css';

function App() {
  const [farmer, setFarmer] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentRecommendation, setCurrentRecommendation] = useState(null);

  useEffect(() => {
    // Check if farmer is logged in
    const storedFarmer = localStorage.getItem('farmer');
    if (storedFarmer) {
      setFarmer(JSON.parse(storedFarmer));
    }
  }, []);

  const handleLoginSuccess = (farmerData) => {
    setFarmer(farmerData);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view, data = null) => {
    setCurrentView(view);
    if (data) {
      setCurrentRecommendation(data);
    }
  };

  const handleRecommendationReceived = (recommendation) => {
    setCurrentRecommendation(recommendation);
    setCurrentView('results');
  };

  const handleProfileUpdate = (updatedFarmer) => {
    setFarmer(updatedFarmer);
  };

  return (
    <ThemeProvider>
      {!farmer ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          {currentView === 'dashboard' && (
            <Dashboard farmer={farmer} onNavigate={handleNavigate} />
          )}
          {currentView === 'recommendation' && (
            <RecommendationForm
              farmer={farmer}
              onRecommendationReceived={handleRecommendationReceived}
              onBack={() => setCurrentView('dashboard')}
            />
          )}
          {currentView === 'results' && currentRecommendation && (
            <Results
              recommendation={currentRecommendation}
              onBack={() => setCurrentView('dashboard')}
            />
          )}
          {currentView === 'profile' && (
            <Profile
              farmer={farmer}
              onBack={() => setCurrentView('dashboard')}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
        </>
      )}
    </ThemeProvider>
  );
}

export default App;
