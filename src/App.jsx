/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
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
  if (isDarkMode) return 'bg-gray-950 text-white';
  if (!isDay) return 'bg-gradient-to-br from-indigo-900 to-gray-900 text-white';
  
  // Sunny
  if (code <= 1) return 'bg-gradient-to-br from-blue-400 to-cyan-200 text-gray-900';
  // Cloudy
  if (code <= 3) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900';
  // Fog
  if (code === 45 || code === 48) return 'bg-gradient-to-br from-gray-400 to-slate-500 text-gray-900';
  // Rain
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'bg-gradient-to-br from-slate-600 to-blue-800 text-white';
  // Snow
  if ((code >= 71 && code <= 77) || code >= 85) return 'bg-gradient-to-br from-blue-100 to-cyan-100 text-gray-900';
  // Thunderstorm
  if (code >= 95) return 'bg-gradient-to-br from-gray-800 to-purple-900 text-white';
  
  return 'bg-gradient-to-br from-blue-400 to-cyan-200 text-gray-900';
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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} transition-colors duration-500`}>
      <div className={`min-h-screen w-full transition-colors duration-1000 ${bgClass}`}>
        <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
          {/* Header */}
          <header className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight opacity-90">
              Smart Weather
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleUnit}
                className="w-12 h-12 flex items-center justify-center rounded-full glass hover:bg-white/50 dark:hover:bg-black/50 transition-all shadow-sm font-bold text-lg"
                aria-label="Toggle Temperature Unit"
              >
                °{tempUnit}
              </button>
              <button
                onClick={toggleTheme}
                className="p-3 w-12 h-12 flex items-center justify-center rounded-full glass hover:bg-white/50 dark:hover:bg-black/50 transition-all shadow-sm"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-6 h-6 text-yellow-300" /> : <Moon className="w-6 h-6 text-indigo-800" />}
              </button>
            </div>
          </header>

          <SearchBar />

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
                <CurrentWeather />
                <div className="mb-8">
                  <SmartInsights />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left Column (Main Charts & Forecast) */}
                  <div className="lg:col-span-3 space-y-8">
                    <WeatherChart />
                    
                    {/* Middle grid for Advanced Components */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-1">
                        <AirQuality />
                      </div>
                      <div className="md:col-span-2">
                        <LiveMap />
                      </div>
                    </div>

                    {/* Bottom grid for Celestial and Trip Planner */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <CelestialInfo />
                      <TripPlanner />
                    </div>
                  </div>

                  {/* Right Column (7-Day Forecast Sidebar) */}
                  <div className="lg:col-span-1">
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
