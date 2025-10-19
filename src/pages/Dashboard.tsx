import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  LocationOn as LocationIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  ExitToApp as ExitIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { Popover, Button as MuiButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useThemeMode } from '../contexts/ThemeContext';
import {
  getCurrentWeather,
  getForecast,
  WeatherData,
  ForecastData,
  getWeatherIcon,
  getMonthlyTemperatureData,
} from '../services/weatherApi';

const Dashboard: React.FC = () => {
  const [city, setCity] = useState('San Francisco');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [settingsAnchor, setSettingsAnchor] = useState<HTMLButtonElement | null>(null);

  const { userName, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const settingsOpen = Boolean(settingsAnchor);

  const monthlyData = getMonthlyTemperatureData();

  const fetchWeatherData = React.useCallback(async (cityName: string, language = 'en') => {
    setLoading(true);
    setError('');
    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(cityName, language),
        getForecast(cityName, language),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err: unknown) {
      let message = t('weather.error');
      try {
        const maybeErr = err as { response?: { data?: { message?: string } } };
        if (maybeErr.response?.data?.message) message = maybeErr.response.data.message;
      } catch {
        // ignore
      }
      setError(message);
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!userName) {
      navigate('/');
      return;
    }
    fetchWeatherData(city, i18n.language);
  }, [userName, navigate, city, i18n.language, fetchWeatherData]);

  

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    fetchWeatherData(newCity, i18n.language);
  };

  const getDayName = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const locale = i18n.language === 'fa' ? 'fa-IR' : 'en-US';
    return date.toLocaleDateString(locale, { weekday: 'short' });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const locale = i18n.language === 'fa' ? 'fa-IR' : 'en-US';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const locale = i18n.language === 'fa' ? 'fa-IR' : 'en-US';
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  };

  // Get 14 days forecast (one per day)
  const getDailyForecasts = () => {
    if (!forecast) return [];
    const dailyMap = new Map();
    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyMap.has(date) || new Date(item.dt * 1000).getHours() === 12) {
        dailyMap.set(date, item);
      }
    });
    return Array.from(dailyMap.values()).slice(0, 14);
  };

  const cities = ['San Francisco', 'New York', 'London', 'Tokyo', 'Tehran', 'Paris', 'Dubai'];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: mode === 'light' ? '#f5f7fa' : '#1a1a2e' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: '#333' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                background: 'linear-gradient(135deg, #42a5f5 0%, #478ed1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ color: 'white', fontWeight: 700 }}>W</Typography>
              </Box>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#333' }}>
              {t('dashboard.title')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                displayEmpty
                sx={{
                  backgroundColor: '#f5f7fa',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                }}
              >
                <MenuItem value="" disabled>
                  Search Your Location
                </MenuItem>
                {cities.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <IconButton 
              sx={{ 
                color: '#42a5f5',
                backgroundColor: '#e3f2fd',
                '&:hover': { backgroundColor: '#bbdefb' }
              }} 
              onClick={handleSettingsClick}
            >
              <SettingsIcon />
            </IconButton>

            <Popover
              open={settingsOpen}
              anchorEl={settingsAnchor}
              onClose={handleSettingsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ p: 3, minWidth: 200 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Mode
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <MuiButton
                    variant={mode === 'light' ? 'contained' : 'outlined'}
                    size="small"
                    startIcon={<LightModeIcon />}
                    onClick={() => mode === 'dark' && toggleTheme()}
                    sx={{ flex: 1 }}
                  >
                    Light
                  </MuiButton>
                  <MuiButton
                    variant={mode === 'dark' ? 'contained' : 'outlined'}
                    size="small"
                    startIcon={<DarkModeIcon />}
                    onClick={() => mode === 'light' && toggleTheme()}
                    sx={{ flex: 1 }}
                  >
                    Dark
                  </MuiButton>
                </Box>

                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Language
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <MuiButton
                    variant={i18n.language === 'en' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => i18n.changeLanguage('en')}
                    sx={{ flex: 1 }}
                  >
                    En
                  </MuiButton>
                  <MuiButton
                    variant={i18n.language === 'fa' ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => i18n.changeLanguage('fa')}
                    sx={{ flex: 1 }}
                  >
                    Fa
                  </MuiButton>
                </Box>

                <MuiButton
                  variant="outlined"
                  fullWidth
                  startIcon={<ExitIcon />}
                  onClick={handleLogout}
                  color="error"
                >
                  Exit
                </MuiButton>
              </Box>
            </Popover>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && weather && forecast && (
          <Grid container spacing={3}>
            {/* Current Weather Card */}
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 2,
                  backgroundColor: mode === 'light' ? '#e8f4f8' : '#2d3436',
                  minHeight: 350,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationIcon sx={{ color: mode === 'light' ? '#333' : '#fff' }} />
                  <Typography variant="h6" sx={{ color: mode === 'light' ? '#333' : '#fff' }}>
                    {weather.name}
                  </Typography>
                </Box>

                <Typography variant="h4" fontWeight={700} sx={{ mb: 1, color: mode === 'light' ? '#1a237e' : '#fff' }}>
                  {getDayName(weather.dt)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: mode === 'light' ? '#666' : '#ccc' }}>
                  {formatDate(weather.dt)} {formatTime(weather.dt)}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h1" fontWeight={700} sx={{ color: mode === 'light' ? '#1a237e' : '#fff', fontSize: '4rem' }}>
                      {Math.round(weather.main.temp)}°C
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, color: mode === 'light' ? '#666' : '#ccc' }}>
                      {t('weather.high')}: {Math.round(weather.main.temp_max)} {t('weather.low')}: {Math.round(weather.main.temp_min)}
                    </Typography>
                  </Box>
                  <Box
                    component="img"
                    src={getWeatherIcon(weather.weather[0].icon)}
                    alt={weather.weather[0].description}
                    sx={{ width: 150, height: 150 }}
                  />
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h5" sx={{ textTransform: 'capitalize', color: mode === 'light' ? '#333' : '#fff' }}>
                    {weather.weather[0].description}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: mode === 'light' ? '#666' : '#ccc' }}>
                    {t('weather.feelsLike')} {Math.round(weather.main.feels_like)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Monthly Temperature Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2, minHeight: 350, backgroundColor: mode === 'light' ? '#fff' : '#2d2d2d', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: mode === 'light' ? '#1a237e' : '#fff' }}>
                  {t('dashboard.avgMonthlyTemp')}
                </Typography>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={mode === 'light' ? '#e0e0e0' : '#444'} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: mode === 'light' ? '#666' : '#ccc' }}
                      stroke={mode === 'light' ? '#666' : '#ccc'}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: mode === 'light' ? '#666' : '#ccc' }}
                      stroke={mode === 'light' ? '#666' : '#ccc'}
                      label={{ value: '°C', angle: -90, position: 'insideLeft', fill: mode === 'light' ? '#666' : '#ccc' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: mode === 'light' ? '#fff' : '#333',
                        border: `none ${mode === 'light' ? '#e0e0e0' : '#555'}`,
                        color: mode === 'light' ? '#333' : '#fff'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="#42a5f5" 
                      strokeWidth={3}
                      dot={{ fill: '#42a5f5', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* 2 Weeks Forecast */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: mode === 'light' ? '#e8f4f8' : '#2d2d2d', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3, color: mode === 'light' ? '#1a237e' : '#fff' }}>
                  {t('dashboard.twoWeeksForecast')}
                </Typography>
                <Grid container spacing={2}>
                  {getDailyForecasts().map((day, index) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} xl={1.5} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          textAlign: 'center',
                          backgroundColor: mode === 'light' ? '#d4e9f2' : '#1a1a2e',
                          borderRadius: 2,
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 2,
                          },
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: mode === 'light' ? '#1a237e' : '#fff' }}>
                          {index === 0 ? t('today') : getDayName(day.dt)}
                        </Typography>
                        <Box
                          component="img"
                          src={getWeatherIcon(day.weather[0].icon)}
                          alt={day.weather[0].description}
                          sx={{ width: 70, height: 70, my: 1 }}
                        />
                        <Typography variant="h6" fontWeight={700} sx={{ color: mode === 'light' ? '#1a237e' : '#fff' }}>
                          {Math.round(day.main.temp)}°C
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Footer */}
      <Box
        sx={{
          mt: 4,
          py: 2,
          backgroundColor: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'inherit', gap: 2 }}>
            {/* Footer intentionally left minimal per user request */}
            <Typography variant="body2" color="text.secondary">
              
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
