import {
  Sun, CloudSun, Cloud, CloudRain, CloudLightning,
  Snowflake, Wind, CloudFog, CloudDrizzle, AlignLeft
} from 'lucide-react';
import { format } from 'date-fns';

export const getWeatherInfo = (code) => {
  // WMO Weather interpretation codes (WW)
  const map = {
    0: { label: 'Clear sky', icon: Sun, color: 'text-yellow-400' },
    1: { label: 'Mainly clear', icon: CloudSun, color: 'text-yellow-300' },
    2: { label: 'Partly cloudy', icon: CloudSun, color: 'text-gray-400' },
    3: { label: 'Overcast', icon: Cloud, color: 'text-gray-500' },
    45: { label: 'Fog', icon: CloudFog, color: 'text-gray-400' },
    48: { label: 'Depositing rime fog', icon: CloudFog, color: 'text-gray-400' },
    51: { label: 'Light drizzle', icon: CloudDrizzle, color: 'text-blue-300' },
    53: { label: 'Moderate drizzle', icon: CloudDrizzle, color: 'text-blue-400' },
    55: { label: 'Dense drizzle', icon: CloudDrizzle, color: 'text-blue-500' },
    56: { label: 'Light freezing drizzle', icon: CloudDrizzle, color: 'text-blue-200' },
    57: { label: 'Dense freezing drizzle', icon: CloudDrizzle, color: 'text-blue-300' },
    61: { label: 'Slight rain', icon: CloudRain, color: 'text-blue-400' },
    63: { label: 'Moderate rain', icon: CloudRain, color: 'text-blue-500' },
    65: { label: 'Heavy rain', icon: CloudRain, color: 'text-blue-600' },
    66: { label: 'Light freezing rain', icon: CloudRain, color: 'text-cyan-300' },
    67: { label: 'Heavy freezing rain', icon: CloudRain, color: 'text-cyan-400' },
    71: { label: 'Slight snow fall', icon: Snowflake, color: 'text-blue-100' },
    73: { label: 'Moderate snow fall', icon: Snowflake, color: 'text-blue-200' },
    75: { label: 'Heavy snow fall', icon: Snowflake, color: 'text-blue-300' },
    77: { label: 'Snow grains', icon: Snowflake, color: 'text-blue-200' },
    80: { label: 'Slight rain showers', icon: CloudRain, color: 'text-blue-400' },
    81: { label: 'Moderate rain showers', icon: CloudRain, color: 'text-blue-500' },
    82: { label: 'Violent rain showers', icon: CloudRain, color: 'text-blue-600' },
    85: { label: 'Slight snow showers', icon: Snowflake, color: 'text-blue-200' },
    86: { label: 'Heavy snow showers', icon: Snowflake, color: 'text-blue-300' },
    95: { label: 'Thunderstorm', icon: CloudLightning, color: 'text-yellow-500' },
    96: { label: 'Thunderstorm with slight hail', icon: CloudLightning, color: 'text-yellow-600' },
    99: { label: 'Thunderstorm with heavy hail', icon: CloudLightning, color: 'text-yellow-600' },
  };

  return map[code] || { label: 'Unknown', icon: AlignLeft, color: 'text-gray-400' };
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return format(new Date(timeString), 'h:mm a');
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'EEEE, MMMM do');
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'EEE'); // e.g., 'Mon'
};

export const convertTemp = (tempC, unit) => {
  if (unit === 'F') {
    return (tempC * 9) / 5 + 32;
  }
  return tempC;
};
