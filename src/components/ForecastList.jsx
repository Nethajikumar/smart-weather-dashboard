/* eslint-disable no-unused-vars */
import { useWeather } from '../context/WeatherContext';
import { getWeatherInfo, formatShortDate, convertTemp } from '../utils/formatUtils';
import { motion } from 'framer-motion';

const ForecastList = () => {
  const { weatherData, tempUnit } = useWeather();

  if (!weatherData || !weatherData.daily) return null;

  const { time, weather_code, temperature_2m_max, temperature_2m_min } = weatherData.daily;

  // Grab up to 14 days, filtering out incomplete data
  const forecastDays = time.slice(1, 15).map((date, index) => {
    const max = temperature_2m_max[index + 1];
    const min = temperature_2m_min[index + 1];
    if (date === undefined || max === undefined || min === undefined) return null;
    
    return {
      date,
      code: weather_code[index + 1],
      maxTemp: convertTemp(max, tempUnit),
      minTemp: convertTemp(min, tempUnit)
    };
  }).filter(Boolean);

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
    <div className="glass-card p-4 md:p-6 h-fit flex flex-col mb-8">
      <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-800 dark:text-gray-100">14-Day Forecast</h3>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2 md:gap-4"
      >
        {forecastDays.map((day, i) => {
          const info = getWeatherInfo(day.code);
          const Icon = info.icon;
          
          return (
            <motion.div 
              key={day.date} 
              variants={item}
              className="flex items-center justify-between p-2 md:p-3 xl:p-4 rounded-xl hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
            >
              <span className="w-12 md:w-16 text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
                {i === 0 ? 'Tmw' : formatShortDate(day.date)}
              </span>
              
              <div className="flex items-center gap-2 md:gap-3 flex-1 px-1 md:px-2 justify-start md:justify-center overflow-hidden">
                <Icon className={`w-5 h-5 md:w-6 md:h-6 shrink-0 ${info.color}`} />
                <span className="hidden sm:inline text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-[60px] md:max-w-[100px] lg:max-w-none truncate">
                  {info.label}
                </span>
              </div>
              
              <div className="flex items-center gap-2 md:gap-3 text-right w-20 md:w-28 justify-end shrink-0">
                <span className="text-xs md:text-sm lg:text-base text-gray-500 dark:text-gray-400 w-8">{Math.round(day.minTemp)}°</span>
                <div className="flex-1 max-w-[60px] h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden hidden lg:block">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-orange-400"
                    style={{
                      marginLeft: `${Math.max(0, (day.minTemp + 10) * 2)}%`,
                      width: `${Math.min(100, (day.maxTemp - day.minTemp) * 3)}%`
                    }}
                  />
                </div>
                <span className="text-sm md:text-base font-semibold w-8">{Math.round(day.maxTemp)}°</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ForecastList;
