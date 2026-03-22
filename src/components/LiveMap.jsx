import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useWeather } from '../context/WeatherContext';
import { useEffect } from 'react';
import { Map as MapIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RecenterMap = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);
  return null;
};

const LiveMap = () => {
  const { location } = useWeather();
  const { isDarkMode } = useTheme();
  
  if (!location || !location.lat || !location.lon) return null;

  // Choose a dark or light map tile theme based on context
  const mapUrl = isDarkMode 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 w-full h-[400px] flex flex-col"
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MapIcon className="w-5 h-5 text-emerald-500" /> Interactive Map
      </h3>
      <div className="flex-1 rounded-xl overflow-hidden relative z-0 shadow-inner border border-white/10">
        <MapContainer 
          center={[location.lat, location.lon]} 
          zoom={10} 
          scrollWheelZoom={false} 
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url={mapUrl}
          />
          <Marker position={[location.lat, location.lon]} />
          <RecenterMap lat={location.lat} lon={location.lon} />
        </MapContainer>
      </div>
    </motion.div>
  );
};

export default LiveMap;
