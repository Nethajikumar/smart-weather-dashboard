import { useWeather } from '../context/WeatherContext';
import { Wind, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const getAQIStatus = (aqi) => {
  if (aqi <= 50) return { label: 'Good', color: 'text-green-500', bg: 'bg-green-500/20', border: 'border-green-500/30' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
  if (aqi <= 150) return { label: 'Sensitive', color: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-500', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  return { label: 'Hazardous', color: 'text-purple-500', bg: 'bg-purple-500/20', border: 'border-purple-500/30' };
};

const getUVStatus = (uv) => {
  if (uv <= 2) return { label: 'Low', color: 'text-green-500' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-500' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-500' };
  if (uv <= 10) return { label: 'Very High', color: 'text-red-500' };
  return { label: 'Extreme', color: 'text-purple-500' };
};

const AirQuality = () => {
  const { airQualityData } = useWeather();
  if (!airQualityData || !airQualityData.current) {
    return (
      <div className="glass-card p-6 w-full h-full flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500">Air quality data unavailable</p>
      </div>
    );
  }

  const { us_aqi, pm10, pm2_5, uv_index } = airQualityData.current;
  const aqiStatus = getAQIStatus(us_aqi);
  const uvStatus = getUVStatus(uv_index);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card p-6 w-full h-full flex flex-col justify-between border ${aqiStatus.border}`}
    >
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Wind className="w-5 h-5 text-blue-500" /> Air Quality & UV
      </h3>
      
      <div className="flex flex-col gap-6 flex-1 justify-center">
        {/* AQI Main */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">US AQI</p>
            <p className="text-5xl font-bold tracking-tighter">{Math.round(us_aqi)}</p>
          </div>
          <div className={`px-4 py-2 rounded-full ${aqiStatus.bg} ${aqiStatus.color} font-semibold shadow-sm`}>
            {aqiStatus.label}
          </div>
        </div>

        {/* Pollutants grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-4 rounded-xl flex flex-col items-center text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">PM 2.5</p>
            <p className="text-lg font-bold">{pm2_5} <span className="text-xs font-normal text-gray-400">µg/m³</span></p>
          </div>
          <div className="glass p-4 rounded-xl flex flex-col items-center text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">PM 10</p>
            <p className="text-lg font-bold">{pm10} <span className="text-xs font-normal text-gray-400">µg/m³</span></p>
          </div>
        </div>

        {/* UV Index */}
        <div className="flex items-center justify-between glass p-5 rounded-2xl mt-2 relative overflow-hidden">
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${aqiStatus.bg.split('/')[0].replace('bg-', 'bg-')}`} />
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${aqiStatus.bg}`}>
              <Sun className={`w-6 h-6 ${uvStatus.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">UV Index</p>
              <p className={`text-sm font-bold ${uvStatus.color}`}>{uvStatus.label}</p>
            </div>
          </div>
          <p className="text-3xl font-bold">{uv_index}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AirQuality;
