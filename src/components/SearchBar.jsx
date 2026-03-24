/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { Search, MapPin, Loader2, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCityCoordinates } from '../services/weatherApi';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const { loadCity, getCurrentLocation, loading, favorites, recentSearches } = useWeather();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim().length <= 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsTyping(true);
      try {
        const results = await fetchCityCoordinates(query.trim());
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsTyping(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || suggestions.length === 0) return;
    
    // Select the best match from suggestions
    const topResult = suggestions[0];
    const cityObj = {
      name: topResult.name,
      country: topResult.country,
      admin1: topResult.admin1,
      lat: topResult.latitude,
      lon: topResult.longitude
    };
    await handleSelectCity(cityObj);
  };

  const handleSelectCity = async (cityObj) => {
    setShowDropdown(false);
    setIsSearching(true);
    await loadCity(cityObj);
    setIsSearching(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mb-6 md:mb-8 relative z-50 lg:mx-0 lg:max-w-none"
      ref={dropdownRef}
    >
      <div className="max-w-2xl mx-auto lg:mx-0">
        <form onSubmit={handleSearch} className="relative flex items-center w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search for a city..."
            className="w-full pl-10 md:pl-12 pr-12 md:pr-16 py-3 md:py-4 rounded-full glass bg-white/40 dark:bg-black/40 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all font-medium text-base md:text-lg"
            disabled={loading || isSearching}
          />
          <div className="absolute inset-y-0 right-2 flex items-center pr-2 gap-2">
            {isSearching ? (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
            ) : (
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loading}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-600 dark:text-blue-300 rounded-full transition-colors flex items-center justify-center"
                title="Use Current Location"
              >
                <MapPin className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>

        <AnimatePresence>
          {showDropdown && (!loading) && (query.length > 2 || favorites.length > 0 || recentSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 glass-card p-4 z-50 rounded-2xl flex flex-col gap-4 text-left shadow-2xl overflow-hidden"
            >
              {query.length > 2 ? (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2 uppercase tracking-wide">
                    <Search className="w-4 h-4" /> Suggestions
                  </h4>
                  <div className="flex flex-col gap-1 max-h-[250px] overflow-y-auto pr-1">
                    {isTyping && <p className="text-sm text-gray-500 p-2 italic">Searching...</p>}
                    {!isTyping && suggestions.length === 0 && <p className="text-sm text-gray-500 p-2 italic">No cities found.</p>}
                    {!isTyping && suggestions.map((city, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectCity({
                          name: city.name,
                          country: city.country,
                          admin1: city.admin1,
                          lat: city.latitude,
                          lon: city.longitude
                        })}
                        className="text-left px-4 py-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors w-full flex flex-col"
                      >
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{city.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {[city.admin1, city.country].filter(Boolean).join(', ')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {favorites.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2 uppercase tracking-wide">
                    <Star className="w-4 h-4" /> Favorites
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {favorites.map((fav, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectCity(fav)}
                        className="px-3 py-1.5 bg-yellow-400/20 hover:bg-yellow-400/40 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium transition-colors border border-yellow-400/30"
                      >
                        {fav.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {recentSearches.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2 uppercase tracking-wide">
                    <Clock className="w-4 h-4" /> Recent
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((recent, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectCity(recent)}
                        className="px-3 py-1.5 bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 rounded-full text-sm font-medium transition-colors border border-gray-300/30 dark:border-gray-600/30"
                      >
                        {recent.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchBar;
