/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCityCoordinates, fetchWeatherData, fetchAirQuality } from '../services/weatherApi';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [location, setLocation] = useState(null); // { name, country, admin1, lat, lon }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('weather_favorites')) || []; }
    catch { return []; }
  });
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('weather_recent')) || []; }
    catch { return []; }
  });
  const [tempUnit, setTempUnit] = useState(() => {
    return localStorage.getItem('weather_unit') || 'C';
  });

  useEffect(() => {
    localStorage.setItem('weather_unit', tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem('weather_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('weather_recent', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const toggleFavorite = (cityObj) => {
    if (!cityObj || !cityObj.name || cityObj.name === "Current Location") return;
    setFavorites(prev => {
      const exists = prev.find(fav => fav.name === cityObj.name && fav.admin1 === cityObj.admin1);
      if (exists) return prev.filter(fav => !(fav.name === cityObj.name && fav.admin1 === cityObj.admin1));
      return [...prev, cityObj];
    });
  };

  const addToRecent = (cityObj) => {
    if (!cityObj || !cityObj.name || cityObj.name === "Current Location") return;
    setRecentSearches(prev => {
      const filtered = prev.filter(city => !(city.name === cityObj.name && city.admin1 === cityObj.admin1));
      return [cityObj, ...filtered].slice(0, 5); // Keep max 5
    });
  };

  const loadCity = async (cityObj) => {
    await loadWeatherByCoords(cityObj.lat, cityObj.lon, cityObj);
    addToRecent(cityObj);
  };

  // Helper to load weather by coords
  const loadWeatherByCoords = async (lat, lon, locationInfo = null) => {
    setLoading(true);
    setError(null);
    try {
      const [weather, aqi] = await Promise.all([
        fetchWeatherData(lat, lon),
        fetchAirQuality(lat, lon).catch(() => null) // fail gracefully
      ]);
      setWeatherData(weather);
      setAirQualityData(aqi);
      
      if (locationInfo) {
        setLocation(locationInfo);
      } else {
        // Fallback for geolocation
        setLocation({ name: "Current Location", lat, lon });
      }
    } catch {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Search for a city
  const searchCity = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchCityCoordinates(cityName);
      const topResult = results[0];
      const cityObj = {
        name: topResult.name,
        country: topResult.country,
        admin1: topResult.admin1,
        lat: topResult.latitude,
        lon: topResult.longitude
      };
      await loadWeatherByCoords(cityObj.lat, cityObj.lon, cityObj);
      addToRecent(cityObj);
    } catch (err) {
      setError(err.message || "City not found.");
      setLoading(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        // Default to a known city if denied
        searchCity("New York");
        setError("Location access denied. Showing default location.");
      }
    );
  };

  // Initial load
  useEffect(() => {
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleUnit = () => {
    setTempUnit(prev => (prev === 'C' ? 'F' : 'C'));
  };

  return (
    <WeatherContext.Provider value={{ 
      weatherData, airQualityData, location, loading, error, 
      searchCity, loadCity, getCurrentLocation,
      favorites, recentSearches, toggleFavorite,
      tempUnit, toggleUnit
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
