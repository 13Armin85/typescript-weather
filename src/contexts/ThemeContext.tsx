import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode');
    return (saved as ThemeMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1976d2' : '#90caf9',
            light: mode === 'light' ? '#42a5f5' : '#bbdefb',
            dark: mode === 'light' ? '#1565c0' : '#64b5f6',
          },
          secondary: {
            main: mode === 'light' ? '#9c27b0' : '#ce93d8',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#000000' : '#ffffff',
            secondary: mode === 'light' ? '#666666' : '#b0b0b0',
          },
        },
        typography: {
          fontFamily: i18n.language === 'fa' 
            ? "'Vazirmatn', 'Inter', sans-serif" 
            : "'Inter', 'Vazirmatn', sans-serif",
        },
        direction: i18n.language === 'fa' ? 'rtl' : 'ltr',
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light' 
                  ? '0 2px 8px rgba(0,0,0,0.1)' 
                  : '0 2px 8px rgba(0,0,0,0.3)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [mode, i18n.language]
  );

  useEffect(() => {
    document.body.dir = i18n.language === 'fa' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
