import axios from 'axios';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1';

export const fetchCityCoordinates = async (cityName) => {
  const response = await axios.get(`${GEOCODING_BASE}/search`, {
    params: {
      name: cityName,
      count: 5,
      language: 'en',
      format: 'json'
    }
  });
  
  if (!response.data.results || response.data.results.length === 0) {
    throw new Error("City not found");
  }
  
  return response.data.results;
};

export const fetchWeatherData = async (lat, lon) => {
  const response = await axios.get(`${OPEN_METEO_BASE}/forecast`, {
    params: {
      latitude: lat,
      longitude: lon,
      current: ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'is_day', 'precipitation', 'rain', 'showers', 'snowfall', 'weather_code', 'cloud_cover', 'pressure_msl', 'surface_pressure', 'wind_speed_10m', 'wind_direction_10m'],
      daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'apparent_temperature_max', 'apparent_temperature_min', 'sunrise', 'sunset', 'uv_index_max', 'precipitation_probability_max'],
      hourly: ['temperature_2m', 'weather_code', 'relative_humidity_2m', 'wind_speed_10m'],
      timezone: 'auto',
      forecast_days: 15
    }
  });
  
  return response.data;
};

export const fetchAirQuality = async (lat, lon) => {
  const response = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality', {
    params: {
      latitude: lat,
      longitude: lon,
      current: ['us_aqi', 'pm10', 'pm2_5', 'uv_index'],
      timezone: 'auto'
    }
  });
  return response.data;
};

export const fetchHistoricalAverages = async (lat, lon, startDate, endDate) => {
  const response = await axios.get('https://archive-api.open-meteo.com/v1/archive', {
    params: {
      latitude: lat,
      longitude: lon,
      start_date: startDate,
      end_date: endDate,
      daily: ['temperature_2m_max', 'temperature_2m_min', 'precipitation_sum'],
      timezone: 'auto'
    }
  });
  return response.data;
};
