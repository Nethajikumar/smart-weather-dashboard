/* eslint-disable no-unused-vars */
import { useWeather } from '../context/WeatherContext';
import { getWeatherInfo, formatShortDate, convertTemp } from '../utils/formatUtils';
import { motion } from 'framer-motion';

const ForecastList = () => {
  const { weatherData, tempUnit } = useWeather();

  if (!weatherData || !weatherData.daily) return null;

  const { time, weather_code, temperature_2m_max, temperature_2m_min } = weatherData.daily;

  // Grab up to 14 days
  const forecastDays = time.slice(1, 15).map((date, index) => ({
    date,
    code: weather_code[index + 1],
    maxTemp: convertTemp(temperature_2m_max[index + 1], tempUnit),
    minTemp: convertTemp(temperature_2m_min[index + 1], tempUnit)
  }));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="glass-card p-6 w-full">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">14-Day Forecast</h3>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4"
      >
        {forecastDays.map((day, i) => {
          const info = getWeatherInfo(day.code);
          const Icon = info.icon;
          
          return (
            <motion.div 
              key={day.date} 
              variants={item}
              className="flex items-center justify-between p-3 xl:p-4 rounded-xl hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
            >
              <span className="w-16 font-medium text-gray-700 dark:text-gray-200">
                {i === 0 ? 'Tmw' : formatShortDate(day.date)}
              </span>
              
              <div className="flex items-center gap-3 w-1/3 justify-start md:justify-center">
                <Icon className={`w-6 h-6 ${info.color}`} />
                <span className="hidden md:inline text-sm text-gray-500 dark:text-gray-400 w-24 truncate">
                  {info.label}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-right w-24 justify-end">
                <span className="text-gray-500 dark:text-gray-400">{Math.round(day.minTemp)}°</span>
                <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden hidden sm:block">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-orange-400"
                    style={{
                      marginLeft: `${Math.max(0, (day.minTemp + 10) * 2)}%`,
                      width: `${Math.min(100, (day.maxTemp - day.minTemp) * 3)}%`
                    }}
                  />
                </div>
                <span className="font-semibold">{Math.round(day.maxTemp)}°</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ForecastList;
