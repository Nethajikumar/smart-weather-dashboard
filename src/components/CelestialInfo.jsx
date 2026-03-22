import { useWeather } from '../context/WeatherContext';
import { Sunrise, Sunset } from 'lucide-react';
import { formatTime } from '../utils/formatUtils';
import { motion } from 'framer-motion';

const CelestialInfo = () => {
  const { weatherData } = useWeather();
  if (!weatherData || !weatherData.daily || !weatherData.daily.sunrise) return null;

  const sunrise = new Date(weatherData.daily.sunrise[0]);
  const sunset = new Date(weatherData.daily.sunset[0]);
  const now = new Date();

  // Calculate sun progress (0 to 100%)
  const totalDaylight = sunset - sunrise;
  const currentDaylight = now - sunrise;
  let progress = (currentDaylight / totalDaylight) * 100;
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 w-full flex flex-col items-center justify-between"
    >
      <h3 className="text-xl font-semibold mb-6 flex items-center justify-self-start self-start gap-2">
        <Sunrise className="w-5 h-5 text-orange-400" /> Sun & Moon
      </h3>

      {/* Sun Arc Visualization */}
      <div className="relative w-full max-w-[200px] aspect-[2/1] overflow-hidden mb-6 mt-4">
        {/* Fixed Arc Background Layer */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 50">
          <path 
            d="M 5 50 A 45 45 0 0 1 95 50" 
            fill="none" 
            stroke="currentColor" 
            className="text-gray-300 dark:text-gray-700 opacity-50"
            strokeWidth="2" 
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
        </svg>
        
        {/* Active Arc Progress */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 50">
          <path 
            d="M 5 50 A 45 45 0 0 1 95 50" 
            fill="none" 
            stroke="url(#sun-gradient)" 
            strokeWidth="3" 
            strokeDasharray="141.37" 
            strokeDashoffset={141.37 - (141.37 * progress) / 100}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="sun-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          
          {/* Glowing Sun Position Indicator */}
          {progress > 0 && progress < 100 && (
            <circle 
              cx={50 - 45 * Math.cos(Math.PI * (progress / 100))}
              cy={50 - 45 * Math.sin(Math.PI * (progress / 100))}
              r="5" 
              fill="#fbbf24" 
              className="drop-shadow-[0_0_12px_rgba(251,191,36,1)]"
            />
          )}
        </svg>

        {/* Base Horizon Line */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>

      <div className="flex justify-between w-full px-2">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1 justify-center uppercase font-medium tracking-wide">
            <Sunrise className="w-3 h-3 text-yellow-500"/> Sunrise
          </p>
          <p className="font-bold text-lg">{formatTime(sunrise)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1 justify-center uppercase font-medium tracking-wide">
            <Sunset className="w-3 h-3 text-orange-500"/> Sunset
          </p>
          <p className="font-bold text-lg">{formatTime(sunset)}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CelestialInfo;
