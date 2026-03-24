import { useWeather } from '../context/WeatherContext';
import { format } from 'date-fns';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { convertTemp } from '../utils/formatUtils';

const CustomTooltip = ({ active, payload, label, tempUnit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-orange-500">Temperature: {payload[0].value}°{tempUnit}</p>
        {payload[1] && <p className="text-blue-500">Humidity: {payload[1].value}%</p>}
      </div>
    );
  }
  return null;
};

const WeatherChart = () => {
  const { weatherData, tempUnit } = useWeather();
  const { isDarkMode } = useTheme();

  if (!weatherData || !weatherData.hourly) return null;

  const currentIndex = weatherData.hourly.time.findIndex(t => new Date(t) > new Date()) || 0;
  const startIndex = Math.max(0, currentIndex === -1 ? 0 : currentIndex - 1);
  const endIndex = Math.min(weatherData.hourly.time.length, startIndex + 24);

  const chartData = weatherData.hourly.time.slice(startIndex, endIndex).map((t, i) => ({
    time: format(new Date(t), 'h:mm a'),
    temp: Math.round(convertTemp(weatherData.hourly.temperature_2m[startIndex + i] || 0, tempUnit)),
    humidity: weatherData.hourly.relative_humidity_2m[startIndex + i] || 0
  }));  return (
    <div className="glass-card p-4 md:p-6 w-full h-[300px] md:h-[400px]">
      <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-6 text-gray-800 dark:text-gray-100">24-Hour Forecast</h3>
      <div className="h-[220px] md:h-[300px] w-full mt-2 md:mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              minTickGap={20}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              domain={['dataMin - 2', 'auto']}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false}
              tickLine={false}
              tick={false}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip tempUnit={tempUnit} />} />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="temp" 
              stroke="#f97316" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316' }}
            />
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="humidity" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorHum)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherChart;
