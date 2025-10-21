import axios from "axios";

export interface WeatherData {
  coord: { lon: number; lat: number };
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
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
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
    clouds: { all: number };
    wind: { speed: number; deg: number };
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

const geocodeCity = async (city: string, language = "en") => {
  const url = "https://geocoding-api.open-meteo.com/v1/search";
  const resp = await axios.get(url, {
    params: { name: city, count: 1, language, format: "json" },
  });
  const data = resp.data;
  if (!data || !data.results || data.results.length === 0) {
    throw new Error(`Could not geocode city: ${city}`);
  }
  return data.results[0];
};

const weatherCodeMap: Record<
  number,
  { icon: string; main: string; description: string }
> = {
  0: { icon: "01d", main: "Clear", description: "Clear sky" },
  1: { icon: "02d", main: "Mainly clear", description: "Mainly clear" },
  2: { icon: "03d", main: "Partly cloudy", description: "Partly cloudy" },
  3: { icon: "04d", main: "Overcast", description: "Overcast" },
  45: { icon: "50d", main: "Fog", description: "Fog" },
  48: {
    icon: "50d",
    main: "Depositing rime fog",
    description: "Depositing rime fog",
  },
  51: { icon: "09d", main: "Drizzle", description: "Light drizzle" },
  53: { icon: "09d", main: "Drizzle", description: "Moderate drizzle" },
  55: { icon: "09d", main: "Drizzle", description: "Dense drizzle" },
  56: {
    icon: "13d",
    main: "Freezing Drizzle",
    description: "Freezing drizzle",
  },
  57: {
    icon: "13d",
    main: "Freezing Drizzle",
    description: "Dense freezing drizzle",
  },
  61: { icon: "10d", main: "Rain", description: "Slight rain" },
  63: { icon: "10d", main: "Rain", description: "Moderate rain" },
  65: { icon: "10d", main: "Rain", description: "Heavy rain" },
  66: {
    icon: "13d",
    main: "Freezing Rain",
    description: "Light freezing rain",
  },
  67: {
    icon: "13d",
    main: "Freezing Rain",
    description: "Heavy freezing rain",
  },
  71: { icon: "13d", main: "Snow", description: "Slight snow fall" },
  73: { icon: "13d", main: "Snow", description: "Moderate snow fall" },
  75: { icon: "13d", main: "Snow", description: "Heavy snow fall" },
  77: { icon: "13d", main: "Snow grains", description: "Snow grains" },
  80: { icon: "09d", main: "Rain showers", description: "Slight rain showers" },
  81: {
    icon: "09d",
    main: "Rain showers",
    description: "Moderate rain showers",
  },
  82: {
    icon: "09d",
    main: "Rain showers",
    description: "Violent rain showers",
  },
  85: { icon: "13d", main: "Snow showers", description: "Slight snow showers" },
  86: { icon: "13d", main: "Snow showers", description: "Heavy snow showers" },
  95: { icon: "11d", main: "Thunderstorm", description: "Thunderstorm" },
  96: {
    icon: "11d",
    main: "Thunderstorm with hail",
    description: "Thunderstorm with slight hail",
  },
  99: {
    icon: "11d",
    main: "Thunderstorm with hail",
    description: "Thunderstorm with heavy hail",
  },
};

const weatherCodeFaMap: Record<number, string> = {
  0: "آسمان صاف",
  1: "نیمه‌آسمان صاف",
  2: "کمی ابری",
  3: "پوشیده از ابر",
  45: "مه",
  48: "مه همراه با یخ",
  51: "نم نم باران",
  53: "باران نم نم",
  55: "باران شدید",
  56: "نم نم یخبندان",
  57: "یخبندان شدید",
  61: "باران خفیف",
  63: "باران متوسط",
  65: "باران سنگین",
  66: "باران یخی خفیف",
  67: "باران یخی سنگین",
  71: "برف خفیف",
  73: "برف متوسط",
  75: "برف سنگین",
  77: "ذرات برف",
  80: "رگبار خفیف",
  81: "رگبار متوسط",
  82: "رگبار شدید",
  85: "بارش برف خفیف",
  86: "بارش برف سنگین",
  95: "طوفان همراه با رعد و برق",
  96: "طوفان با تگرگ خفیف",
  99: "طوفان با تگرگ شدید",
};

const mapWeatherCode = (code: number) => {
  return (
    weatherCodeMap[code] || {
      icon: "03d",
      main: "Unknown",
      description: "Unknown",
    }
  );
};

export const getWeatherIcon = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
};

const toUnix = (iso?: string) =>
  iso
    ? Math.floor(new Date(iso).getTime() / 1000)
    : Math.floor(Date.now() / 1000);

export const getCurrentWeather = async (
  city: string,
  language = "en"
): Promise<WeatherData> => {
  const place = await geocodeCity(city, language);
  const lat = place.latitude;
  const lon = place.longitude;

  const url = "https://api.open-meteo.com/v1/forecast";
  const resp = await axios.get(url, {
    params: {
      latitude: lat,
      longitude: lon,
      current_weather: true,
      daily: "temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset",
      hourly: "apparent_temperature,temperature_2m,weathercode",
      timezone: "UTC",
      forecast_days: 14,
    },
  });

  const data = resp.data;
  const current = data.current_weather;
  const daily = data.daily || {};

  const temp_max = daily.temperature_2m_max?.[0] ?? current.temperature;
  const temp_min = daily.temperature_2m_min?.[0] ?? current.temperature;
  const weathercode = daily.weathercode?.[0] ?? current.weathercode ?? 0;
  const mapped = mapWeatherCode(weathercode);
  const description =
    language === "fa"
      ? weatherCodeFaMap[weathercode] || mapped.description
      : mapped.description;

  let feels_like = current.temperature;
  try {
    if (data.hourly && data.hourly.apparent_temperature && current.time) {
      const hourIndex = data.hourly.time.indexOf(current.time);
      if (hourIndex >= 0)
        feels_like = data.hourly.apparent_temperature[hourIndex];
    }
  } catch (e) {
    void e;
  }

  const result: WeatherData = {
    coord: { lon: lon, lat: lat },
    weather: [
      { id: weathercode, main: mapped.main, description, icon: mapped.icon },
    ],
    base: "open-meteo",
    main: {
      temp: current.temperature,
      feels_like: feels_like,
      temp_min,
      temp_max,
      pressure: 0,
      humidity: 0,
    },
    visibility: 10000,
    wind: { speed: current.windspeed ?? 0, deg: current.winddirection ?? 0 },
    clouds: { all: 0 },
    dt: toUnix(current.time),
    sys: {
      country: place.country ?? "",
      sunrise: toUnix(daily.sunrise?.[0]),
      sunset: toUnix(daily.sunset?.[0]),
    },
    timezone: 0,
    id: place.id ?? 0,
    name: place.name ?? city,
    cod: 200,
  };

  return result;
};

export const getCurrentWeatherByCoords = async (
  lat: number,
  lon: number,
  language = "en"
): Promise<WeatherData> => {
  const url = "https://api.open-meteo.com/v1/forecast";
  const resp = await axios.get(url, {
    params: {
      latitude: lat,
      longitude: lon,
      current_weather: true,
      daily: "temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset",
      hourly: "apparent_temperature,temperature_2m,weathercode",
      timezone: "UTC",
      forecast_days: 14,
    },
  });
  const data = resp.data;
  const current = data.current_weather;
  const daily = data.daily || {};

  const temp_max = daily.temperature_2m_max?.[0] ?? current.temperature;
  const temp_min = daily.temperature_2m_min?.[0] ?? current.temperature;
  const weathercode = daily.weathercode?.[0] ?? current.weathercode ?? 0;
  const mapped = mapWeatherCode(weathercode);
  const description =
    language === "fa"
      ? weatherCodeFaMap[weathercode] || mapped.description
      : mapped.description;

  let feels_like = current.temperature;
  try {
    if (data.hourly && data.hourly.apparent_temperature && current.time) {
      const hourIndex = data.hourly.time.indexOf(current.time);
      if (hourIndex >= 0)
        feels_like = data.hourly.apparent_temperature[hourIndex];
    }
  } catch (e) {
    // ignore and fallback
    void e;
  }

  const result: WeatherData = {
    coord: { lon: lon, lat: lat },
    weather: [
      { id: weathercode, main: mapped.main, description, icon: mapped.icon },
    ],
    base: "open-meteo",
    main: {
      temp: current.temperature,
      feels_like,
      temp_min,
      temp_max,
      pressure: 0,
      humidity: 0,
    },
    visibility: 10000,
    wind: { speed: current.windspeed ?? 0, deg: current.winddirection ?? 0 },
    clouds: { all: 0 },
    dt: toUnix(current.time),
    sys: {
      country: "",
      sunrise: toUnix(daily.sunrise?.[0]),
      sunset: toUnix(daily.sunset?.[0]),
    },
    timezone: 0,
    id: 0,
    name: `${lat},${lon}`,
    cod: 200,
  };

  return result;
};

export const getForecast = async (
  city: string,
  language = "en"
): Promise<ForecastData> => {
  const place = await geocodeCity(city, language);
  const lat = place.latitude;
  const lon = place.longitude;

  const url = "https://api.open-meteo.com/v1/forecast";
  const resp = await axios.get(url, {
    params: {
      latitude: lat,
      longitude: lon,
      daily: "temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset",
      timezone: "UTC",
      forecast_days: 14,
    },
  });

  const data = resp.data;
  const daily = data.daily || {};

  const list: ForecastData["list"] = [];
  const days = daily.time || [];
  for (let i = 0; i < days.length; i++) {
    const dt_iso = daily.time[i];
    const dt = toUnix(dt_iso);
    const tmax = daily.temperature_2m_max?.[i] ?? 0;
    const tmin = daily.temperature_2m_min?.[i] ?? 0;
    const temp = (tmax + tmin) / 2;
    const weathercode = daily.weathercode?.[i] ?? 0;
    const mapped = mapWeatherCode(weathercode);
    const description =
      language === "fa"
        ? weatherCodeFaMap[weathercode] || mapped.description
        : mapped.description;

    list.push({
      dt,
      main: {
        temp,
        feels_like: temp,
        temp_min: daily.temperature_2m_min?.[i] ?? temp,
        temp_max: daily.temperature_2m_max?.[i] ?? temp,
        pressure: 0,
        humidity: 0,
      },
      weather: [
        { id: weathercode, main: mapped.main, description, icon: mapped.icon },
      ],
      clouds: { all: 0 },
      wind: { speed: 0, deg: 0 },
      visibility: 10000,
      pop: 0,
      dt_txt: new Date(dt * 1000).toISOString(),
    });
  }

  const result: ForecastData = {
    list,
    city: {
      name: place.name ?? city,
      country: place.country ?? "",
      timezone: 0,
      sunrise: toUnix(daily.sunrise?.[0]),
      sunset: toUnix(daily.sunset?.[0]),
    },
  };

  return result;
};

export const getMonthlyTemperatureData = () => {
  return [
    { month: "Jan", temp: 20 },
    { month: "Feb", temp: 22 },
    { month: "Mar", temp: 25 },
    { month: "Apr", temp: 28 },
    { month: "May", temp: 30 },
    { month: "Jun", temp: 32 },
    { month: "Jul", temp: 35 },
    { month: "Aug", temp: 34 },
    { month: "Sep", temp: 32 },
    { month: "Oct", temp: 28 },
    { month: "Nov", temp: 24 },
    { month: "Dec", temp: 21 },
  ];
};
