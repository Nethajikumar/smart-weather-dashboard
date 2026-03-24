import { useWeather } from '../context/WeatherContext';
import { Lightbulb, Droplets, Thermometer, Wind, Sun, Umbrella } from 'lucide-react';
import { motion } from 'framer-motion';

const SmartInsights = () => {
  const { weatherData, tempUnit } = useWeather();

  if (!weatherData || !weatherData.current || !weatherData.hourly) return null;

  const current = weatherData.current;
  const insights = [];

  // 1. Feels Like Divergence
  const tempDiff = current.apparent_temperature - current.temperature_2m;
  if (Math.abs(tempDiff) >= 2) {
    const diffDisplay = tempUnit === 'F' ? tempDiff * 1.8 : tempDiff;
    if (tempDiff > 0) {
      insights.push({
        id: 'feels-hot',
        icon: Thermometer,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        title: 'Feels Hotter',
        message: `It feels ${Math.round(diffDisplay)}° warmer than the actual temperature due to humidity.`
      });
    } else {
      insights.push({
        id: 'feels-cold',
        icon: Thermometer,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        title: 'Feels Colder',
        message: `It feels ${Math.round(Math.abs(diffDisplay))}° colder due to wind chill.`
      });
    }
  }

  // 2. Imminent Rain Check
  const currentIndex = weatherData.hourly.time.findIndex(t => new Date(t) > new Date());
  if (currentIndex !== -1) {
    let rainExpected = false;
    for (let i = currentIndex; i < currentIndex + 4; i++) {
      if (weatherData.hourly.precipitation?.[i] > 0 || weatherData.hourly.weather_code[i] >= 51) {
        rainExpected = true;
        break;
      }
    }
    if (rainExpected) {
      insights.push({
        id: 'rain-soon',
        icon: Umbrella,
        color: 'text-blue-400',
        bg: 'bg-blue-400/10',
        title: 'Rain Expected',
        message: 'Precipitation expected in the next few hours. Keep an umbrella handy!'
      });
    }
  }

  // 3. High Humidity
  if (current.relative_humidity_2m > 75) {
    insights.push({
      id: 'high-humidity',
      icon: Droplets,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      title: 'High Humidity',
      message: 'The air is quite moist right now, which may feel uncomfortable.'
    });
  }

  // 4. Windy conditions
  if (current.wind_speed_10m > 25) {
    insights.push({
      id: 'windy',
      icon: Wind,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10',
      title: 'Strong Winds',
      message: `It's windy today with speeds up to ${current.wind_speed_10m} km/h.`
    });
  }

  // 5. Clear Skies
  if (current.cloud_cover < 20 && current.is_day && !insights.find(i => i.id === 'rain-soon')) {
    insights.push({
      id: 'clear-skies',
      icon: Sun,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      title: 'Clear Skies',
      message: 'Perfectly clear skies! A great day to be outside.'
    });
  }
  
  // Fallback if no specific insights match
  if (insights.length === 0) {
    insights.push({
      id: 'normal',
      icon: Lightbulb,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      title: 'Standard Conditions',
      message: 'Looks like a typical day outside with no extreme conditions.'
    });
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="glass-card p-4 md:p-6 w-full h-fit flex flex-col border border-white/10">
      <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" /> Smart Insights
      </h3>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
      >
        {insights.slice(0, 3).map((insight) => {
          const Icon = insight.icon;
          return (
            <motion.div 
              key={insight.id}
              variants={item}
              className={`p-3 md:p-4 rounded-xl flex items-start gap-3 md:gap-4 ${insight.bg} border border-white/10`}
            >
              <div className={`p-2 rounded-full glass bg-white/50 dark:bg-black/50 ${insight.color} shrink-0`}>
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm md:text-base text-gray-800 dark:text-gray-200">{insight.title}</h4>
                <p className="text-[10px] md:text-sm text-gray-600 dark:text-gray-400 mt-0.5 md:mt-1 font-medium">{insight.message}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SmartInsights;
