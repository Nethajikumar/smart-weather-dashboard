import { useState } from 'react';
import { fetchCityCoordinates, fetchHistoricalAverages } from '../services/weatherApi';
import { Plane, Calendar, MapPin, Thermometer, Droplets, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import { convertTemp } from '../utils/formatUtils';

const TripPlanner = () => {
  const { tempUnit } = useWeather();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tripData, setTripData] = useState(null);

  const handlePlanTrip = async (e) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) return;
    
    setLoading(true);
    setError('');
    setTripData(null);

    try {
      const coords = await fetchCityCoordinates(destination);
      if (!coords || coords.length === 0) throw new Error("City not found");
      const loc = coords[0];

      // Convert input dates to 1 year prior to fetch historical seasonal baseline
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setFullYear(start.getFullYear() - 1);
      end.setFullYear(end.getFullYear() - 1);

      const pastStart = start.toISOString().split('T')[0];
      const pastEnd = end.toISOString().split('T')[0];

      const archive = await fetchHistoricalAverages(loc.latitude, loc.longitude, pastStart, pastEnd);
      
      const daily = archive.daily;
      if (!daily || !daily.temperature_2m_max) throw new Error("No archive data available for these dates");

      // Filter out nulls
      const validMax = daily.temperature_2m_max.filter(v => v !== null);
      const validMin = daily.temperature_2m_min.filter(v => v !== null);
      const validRain = daily.precipitation_sum.filter(v => v !== null);

      const avgMax = validMax.length ? validMax.reduce((a, b) => a + b, 0) / validMax.length : 0;
      const avgMin = validMin.length ? validMin.reduce((a, b) => a + b, 0) / validMin.length : 0;
      const totalRain = validRain.length ? validRain.reduce((a, b) => a + b, 0) : 0;

      setTripData({
        location: `${loc.name}${loc.admin1 ? ", " + loc.admin1 : ""}, ${loc.country}`,
        avgMax,
        avgMin,
        totalRain,
        days: daily.time.length
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch trip data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 md:p-5 w-full h-fit flex flex-col border border-white/10">
      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
        <Plane className="w-4 h-4 text-indigo-500" /> Trip Planner
      </h3>

      <form onSubmit={handlePlanTrip} className="space-y-3 mb-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-tight mb-0.5">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input 
              type="text" 
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Tokyo, Paris"
              className="w-full pl-8 pr-3 py-1.5 rounded-lg glass bg-white/40 dark:bg-black/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-tight mb-0.5">Start</label>
            <input 
              type="date" 
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg glass bg-white/40 dark:bg-black/40 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-tight mb-0.5">End</label>
            <input 
              type="date" 
              required
              min={startDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg glass bg-white/40 dark:bg-black/40 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Calendar className="w-4 h-4"/> Plan Trip</>}
        </button>
      </form>

      {error && <p className="text-red-500 text-[10px] p-2 bg-red-500/10 rounded-lg">{error}</p>}

      <AnimatePresence>
        {tripData && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
            <div className="bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/20">
              <h4 className="font-bold text-sm mb-2 truncate">{tripData.location}</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/40 dark:bg-black/40 p-2 rounded-lg flex items-center gap-2">
                  <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">High</p>
                    <p className="font-bold text-sm">{Math.round(convertTemp(tripData.avgMax, tempUnit))}°</p>
                  </div>
                </div>
                <div className="bg-white/40 dark:bg-black/40 p-2 rounded-lg flex items-center gap-2">
                  <Thermometer className="w-3.5 h-3.5 text-blue-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Low</p>
                    <p className="font-bold text-sm">{Math.round(convertTemp(tripData.avgMin, tempUnit))}°</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripPlanner;
