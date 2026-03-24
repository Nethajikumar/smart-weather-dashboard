/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useTheme } from './context/ThemeContext';
import { useWeather } from './context/WeatherContext';
import { Moon, Sun } from 'lucide-react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import WeatherChart from './components/WeatherChart';
import SmartInsights from './components/SmartInsights';
import AirQuality from './components/AirQuality';
import LiveMap from './components/LiveMap';
import CelestialInfo from './components/CelestialInfo';
import TripPlanner from './components/TripPlanner';
import { SkeletonLoader } from './components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';

const getBgClass = (isDarkMode, isDay, code) => {
  const base = 'transition-all duration-1000 ease-in-out ';
  
  if (isDarkMode) return base + 'bg-slate-950 text-white';
  if (!isDay) return base + 'bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white';
  
  // Sunny
  if (code <= 1) return base + 'bg-gradient-to-br from-blue-400 via-sky-300 to-amber-100 text-gray-900';
  // Cloudy
  if (code <= 3) return base + 'bg-gradient-to-br from-slate-300 via-gray-400 to-slate-500 text-gray-900';
  // Fog
  if (code === 45 || code === 48) return base + 'bg-gradient-to-br from-gray-400 via-slate-500 to-gray-600 text-gray-900';
  // Rain
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return base + 'bg-gradient-to-br from-slate-700 via-blue-900 to-indigo-950 text-white';
  // Snow
  if ((code >= 71 && code <= 77) || code >= 85) return base + 'bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-200 text-gray-900';
  // Thunderstorm
  if (code >= 95) return base + 'bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white';
  
  return base + 'bg-gradient-to-br from-blue-400 to-cyan-200 text-gray-900';
};

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { weatherData, loading, error, location, tempUnit, toggleUnit } = useWeather();
  
  useEffect(() => {
    if (location && location.name && location.name !== "Current Location") {
      document.title = `${location.name} Weather | Smart Dashboard`;
    } else {
      document.title = 'Smart Weather Dashboard';
    }
  }, [location]);

  const isDay = weatherData?.current?.is_day ?? 1;
  const weatherCode = weatherData?.current?.weather_code ?? 0;
  
  const bgClass = getBgClass(isDarkMode, isDay, weatherCode);

  const [activeTab, setActiveTab] = useState('current');

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} transition-colors duration-500`}>
      <div className={`min-h-screen w-full transition-colors duration-1000 ${bgClass}`}>
        <main className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
          {/* Header */}
          <header className="flex justify-between items-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent opacity-95">
              Smart Weather
            </h1>
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={toggleUnit}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full glass hover:bg-white/50 dark:hover:bg-black/50 transition-all shadow-sm font-bold text-base md:text-lg"
                aria-label="Toggle Temperature Unit"
              >
                °{tempUnit}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 md:p-3 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full glass hover:bg-white/50 dark:hover:bg-black/50 transition-all shadow-sm"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" /> : <Moon className="w-5 h-5 md:w-6 md:h-6 text-indigo-800" />}
              </button>
            </div>
          </header>

          <SearchBar />

          {/* Mobile Tabs */}
          <div className="flex lg:hidden mb-6 bg-black/5 dark:bg-white/5 p-1 rounded-xl glass">
            {['current', 'forecast', 'planner'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-sm font-bold capitalize rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-white/40 dark:bg-white/20 shadow-sm text-blue-600 dark:text-blue-300' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <SkeletonLoader />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-card p-12 text-center text-red-500 dark:text-red-400"
              >
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold mb-2">Oops!</h2>
                <p className="text-lg">{error}</p>
              </motion.div>
            ) : weatherData ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-10 items-start">
                  {/* Left/Main Column */}
                  <div className={`lg:col-span-3 space-y-6 md:space-y-10 ${activeTab !== 'current' && activeTab !== 'planner' ? 'hidden lg:block' : ''}`}>
                    {/* Current Weather - Always top in main column */}
                    <div className={`${activeTab !== 'current' ? 'hidden lg:block' : ''}`}>
                      <CurrentWeather />
                    </div>

                    {/* 2x2 Core Info Grid (Desktop) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
                      {/* Top Left: Map (Planner Tab) */}
                      <div className={`${activeTab !== 'planner' ? 'hidden lg:block' : ''}`}>
                        <LiveMap />
                      </div>
                      
                      {/* Top Right: Air Quality (Planner Tab) */}
                      <div className={`${activeTab !== 'planner' ? 'hidden lg:block' : ''}`}>
                        <AirQuality />
                      </div>

                      {/* Bottom Left: Sun & Moon (Planner Tab) */}
                      <div className={`${activeTab !== 'planner' ? 'hidden lg:block' : ''}`}>
                        <CelestialInfo />
                      </div>

                      {/* Bottom Right: Trip Planner (Planner Tab) */}
                      <div className={`${activeTab !== 'planner' ? 'hidden lg:block' : ''}`}>
                        <TripPlanner />
                      </div>
                    </div>

                    {/* Full Width Visuals */}
                    <div className="space-y-6 md:space-y-10">
                      <div className={`${activeTab !== 'current' ? 'hidden lg:block' : ''}`}>
                        <SmartInsights />
                      </div>
                      <div className={`${activeTab !== 'current' ? 'hidden lg:block' : ''}`}>
                        <WeatherChart />
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Focus for Forecast tab) */}
                  <div className={`lg:col-span-1 ${activeTab !== 'forecast' ? 'hidden lg:block' : ''}`}>
                    <ForecastList />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
