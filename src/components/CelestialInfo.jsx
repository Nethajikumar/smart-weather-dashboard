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
      className="glass-card p-4 md:p-5 w-full h-fit flex flex-col items-center border border-white/10"
    >
      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center self-start gap-2">
        <Sunrise className="w-4 h-4 text-orange-400" /> Sun & Moon
      </h3>

      {/* Sun Arc Visualization - Scaled down */}
      <div className="relative w-full max-w-[160px] aspect-[2/1] overflow-hidden mb-4 mt-2">
        {/* Fixed Arc Background Layer */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 50">
          <path 
            d="M 5 50 A 45 45 0 0 1 95 50" 
            fill="none" 
            stroke="currentColor" 
            className="text-gray-300 dark:text-gray-700 opacity-40"
            strokeWidth="1.5" 
            strokeLinecap="round"
            strokeDasharray="3 3"
          />
        </svg>
        
        {/* Active Arc Progress */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 50">
          <path 
            d="M 5 50 A 45 45 0 0 1 95 50" 
            fill="none" 
            stroke="url(#sun-gradient-2)" 
            strokeWidth="2.5" 
            strokeDasharray="141.37" 
            strokeDashoffset={141.37 - (141.37 * progress) / 100}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="sun-gradient-2" x1="0" y1="0" x2="1" y2="0">
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
              r="4" 
              fill="#fbbf24" 
              className="drop-shadow-[0_0_8px_rgba(251,191,36,1)]"
            />
          )}
        </svg>

        {/* Base Horizon Line */}
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 w-full gap-2">
        <div className="text-center bg-black/5 dark:bg-white/5 p-2 rounded-lg border border-white/5">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-center uppercase font-bold tracking-tight">
            <Sunrise className="w-3 h-3 text-yellow-500"/> Sunrise
          </p>
          <p className="font-bold text-base">{formatTime(sunrise)}</p>
        </div>
        <div className="text-center bg-black/5 dark:bg-white/5 p-2 rounded-lg border border-white/5">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-center uppercase font-bold tracking-tight">
            <Sunset className="w-3 h-3 text-orange-500"/> Sunset
          </p>
          <p className="font-bold text-base">{formatTime(sunset)}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CelestialInfo;
