import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import weatherIllustration from '../assets/weather-illustration.png';

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('login.nameRequired'));
      return;
    }
    login(name.trim());
    navigate('/dashboard');
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f4f8',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          maxWidth: 900,
          width: '100%',
          overflow: 'hidden',
          borderRadius: 3,
        }}
      >
        {/* Left Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight={600}
            sx={{ mb: 4, color: '#1a1a2e' }}
          >
            Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              error={!!error}
              helperText={error}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                },
              }}
              autoFocus
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={i18n.language}
                label="Language"
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="fa">فارسی</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                backgroundColor: '#2196f3',
                '&:hover': {
                  backgroundColor: '#1976d2',
                },
              }}
            >
              LOGIN
            </Button>
          </form>
        </Box>

        {/* Right Side - Weather Illustration */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e3f2fd',
            p: 4,
            minHeight: { xs: 300, md: 500 },
          }}
        >
          <Box
            component="img"
            src={weatherIllustration}
            alt="Weather Illustration"
            sx={{
              width: '100%',
              maxWidth: 400,
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
