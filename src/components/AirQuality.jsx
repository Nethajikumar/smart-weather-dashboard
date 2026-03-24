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
      className={`glass-card p-4 md:p-5 w-full h-fit flex flex-col border ${aqiStatus.border}`}
    >
      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
        <Wind className="w-4 h-4 text-blue-500" /> Air Quality & UV
      </h3>
      
      <div className="flex flex-col gap-4">
        {/* AQI Main */}
        <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 p-3 rounded-xl">
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5">US AQI</p>
            <p className="text-3xl font-black tracking-tighter">{Math.round(us_aqi)}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs ${aqiStatus.bg} ${aqiStatus.color} font-bold shadow-sm border border-white/10`}>
            {aqiStatus.label}
          </div>
        </div>

        {/* Pollutants grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/5 dark:bg-white/5 p-2 rounded-lg flex flex-col items-center text-center border border-white/5">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 font-bold">PM 2.5</p>
            <p className="text-sm font-bold">{pm2_5} <small className="text-[8px] font-normal opacity-50">µg/m³</small></p>
          </div>
          <div className="bg-black/5 dark:bg-white/5 p-2 rounded-lg flex flex-col items-center text-center border border-white/5">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 font-bold">PM 10</p>
            <p className="text-sm font-bold">{pm10} <small className="text-[8px] font-normal opacity-50">µg/m³</small></p>
          </div>
        </div>

        {/* UV Index */}
        <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${aqiStatus.bg}`}>
              <Sun className={`w-4 h-4 ${uvStatus.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">UV Index</p>
              <p className={`text-[10px] font-bold ${uvStatus.color}`}>{uvStatus.label}</p>
            </div>
          </div>
          <p className="text-2xl font-black">{uv_index}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AirQuality;
