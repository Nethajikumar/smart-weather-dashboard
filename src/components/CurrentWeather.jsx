/* eslint-disable no-unused-vars */
import { useWeather } from '../context/WeatherContext';
import { getWeatherInfo, formatTime, convertTemp } from '../utils/formatUtils';
import { motion } from 'framer-motion';
import { Droplets, Wind, Thermometer, Gauge, Star } from 'lucide-react';

const CurrentWeather = () => {
  const { weatherData, location, favorites, toggleFavorite, tempUnit } = useWeather();

  if (!weatherData || !weatherData.current) return null;

  const current = weatherData.current;
  const weatherInfo = getWeatherInfo(current.weather_code);
  const Icon = weatherInfo.icon;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}
      className="glass-card p-4 md:p-10 text-gray-800 dark:text-gray-100 mb-0 md:mb-8 relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start relative z-10 w-full">
        {/* Main Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-2 md:gap-4 mb-2">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {location?.name}
              {(location?.admin1 || location?.country) && (
                <span className="text-lg md:text-2xl font-normal ml-0 md:ml-2 text-gray-600 dark:text-gray-300 block md:inline">
                  {[location.admin1, location.country].filter(Boolean).join(', ')}
                </span>
              )}
            </h2>
            {location && location.name !== "Current Location" && (
              <button 
                onClick={() => toggleFavorite(location)}
                className={`p-2 rounded-full transition-colors ${favorites?.find(f => f.name === location.name) ? 'bg-yellow-400/20 text-yellow-500' : 'bg-gray-200/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:text-yellow-500 hover:bg-yellow-400/20'}`}
                title="Toggle Favorite"
              >
                <Star className="w-5 h-5 md:w-6 md:h-6" fill={favorites?.find(f => f.name === location.name) ? "currentColor" : "none"} />
              </button>
            )}
          </div>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 mb-4 md:mb-6 font-medium">Today • {formatTime(current.time || new Date())}</p>
          
          <div className="flex items-center gap-4 md:gap-6">
            <Icon className={`w-16 h-16 md:w-24 md:h-24 ${weatherInfo.color} drop-shadow-md animate-float`} />
            <div>
              <div className="text-5xl md:text-7xl font-bold tracking-tighter">
                {Math.round(convertTemp(current.temperature_2m, tempUnit))}°
              </div>
              <div className="text-xl md:text-2xl font-medium mt-0 md:mt-1 text-gray-700 dark:text-gray-300">
                {weatherInfo.label}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 gap-3 md:gap-6 mt-6 md:mt-0 w-full md:w-auto md:min-w-[320px] relative z-20">
          <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-white/40 dark:border-white/20 shadow-md p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4 hover:bg-white/80 dark:hover:bg-black/80 transition-all">
            <Thermometer className="text-orange-500 w-5 h-5 md:w-6 md:h-6" />
            <div>
              <p className="text-[10px] md:text-sm font-medium text-gray-500 dark:text-gray-400">Feels Like</p>
              <p className="text-base md:text-xl font-bold">{Math.round(convertTemp(current.apparent_temperature, tempUnit))}°</p>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-white/40 dark:border-white/20 shadow-md p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4 hover:bg-white/80 dark:hover:bg-black/80 transition-all">
            <Wind className="text-cyan-500 w-5 h-5 md:w-6 md:h-6" />
            <div>
              <p className="text-[10px] md:text-sm font-medium text-gray-500 dark:text-gray-400">Wind</p>
              <p className="text-base md:text-xl font-bold">{current.wind_speed_10m} km/h</p>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-white/40 dark:border-white/20 shadow-md p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4 hover:bg-white/80 dark:hover:bg-black/80 transition-all">
            <Droplets className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
            <div>
              <p className="text-[10px] md:text-sm font-medium text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="text-base md:text-xl font-bold">{current.relative_humidity_2m}%</p>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-white/40 dark:border-white/20 shadow-md p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4 hover:bg-white/80 dark:hover:bg-black/80 transition-all">
            <Gauge className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
            <div>
              <p className="text-[10px] md:text-sm font-medium text-gray-500 dark:text-gray-400">Pressure</p>
              <p className="text-base md:text-xl font-bold">{current.surface_pressure} hPa</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration - subtle and non-intrusive */}
      <Icon className="absolute -top-12 -right-12 w-64 md:w-80 lg:w-96 h-64 md:h-80 lg:h-96 opacity-[0.03] dark:opacity-[0.05] text-gray-900 dark:text-white pointer-events-none animate-slow-pulse" />
    </motion.div>
  );
};

export default CurrentWeather;
