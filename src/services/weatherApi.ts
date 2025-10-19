import axios from 'axios';

// Prefer Vite env var for OpenWeather key
const viteEnv = (import.meta as unknown) as { env?: { VITE_OPENWEATHER_API_KEY?: string; VITE_WEATHER_API_KEY?: string } };
const API_KEY = viteEnv.env?.VITE_OPENWEATHER_API_KEY || viteEnv.env?.VITE_WEATHER_API_KEY || 'YOUR_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    visibility: number;
    pop: number;
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export const getCurrentWeather = async (city: string): Promise<WeatherData> => {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
    throw new Error('OpenWeather API key is missing. Set VITE_OPENWEATHER_API_KEY or VITE_WEATHER_API_KEY in your environment.');
  }

  try {
    // Add a cache-busting timestamp and no-cache headers to avoid 304 Not Modified from intermediaries
    const response = await axios.get<WeatherData>(`${BASE_URL}/weather`, {
      params: {
        q: city,
        units: 'metric',
        appid: API_KEY,
        t: Date.now(), // cache-buster
      },
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    console.error('OpenWeather API Error:', error);
    throw error;
  }
};

/**
 * Fetch current weather by geographic coordinates (lat, lon).
 * Uses cache-busting and no-cache headers to reduce 304 Not Modified responses.
 */
export const getCurrentWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
    throw new Error('OpenWeather API key is missing. Set VITE_OPENWEATHER_API_KEY or VITE_WEATHER_API_KEY in your environment.');
  }

  try {
    const response = await axios.get<WeatherData>(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: API_KEY,
        t: Date.now(),
      },
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    console.error('OpenWeather (coords) API Error:', error);
    throw error;
  }
};

export const getForecast = async (city: string): Promise<ForecastData> => {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
    throw new Error('OpenWeather API key is missing. Set VITE_OPENWEATHER_API_KEY or VITE_WEATHER_API_KEY in your environment.');
  }

  try {
    const response = await axios.get<ForecastData>(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        units: 'metric',
        appid: API_KEY,
        cnt: 56, // 14 days * 4 (every 6 hours)
      },
    });
    return response.data;
  } catch (error) {
    console.error('OpenWeather Forecast API Error:', error);
    throw error;
  }
};

export const getWeatherIcon = (iconCode: string): string => {
  // iconCode is mapped to an OpenWeather-style code (e.g. 01d). Use OpenWeather icons for UI compatibility.
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
};

// Mock data for monthly temperature chart (since free API doesn't provide historical data)
export const getMonthlyTemperatureData = () => {
  return [
    { month: 'Jan', temp: 20 },
    { month: 'Feb', temp: 22 },
    { month: 'Mar', temp: 25 },
    { month: 'Apr', temp: 28 },
    { month: 'May', temp: 30 },
    { month: 'Jun', temp: 32 },
    { month: 'Jul', temp: 35 },
    { month: 'Aug', temp: 34 },
    { month: 'Sep', temp: 32 },
    { month: 'Oct', temp: 28 },
    { month: 'Nov', temp: 24 },
    { month: 'Dec', temp: 21 },
  ];
};
