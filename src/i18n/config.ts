import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Login Page
      'login.title': 'Welcome to Weather Dashboard',
      'login.subtitle': 'Enter your name to continue',
      'login.nameLabel': 'Your Name',
      'login.namePlaceholder': 'Enter your name',
      'login.submitButton': 'Get Started',
      'login.nameRequired': 'Name is required',
      
      // Dashboard
      'dashboard.title': 'Weather Dashboard',
      'dashboard.logout': 'Logout',
      'dashboard.welcome': 'Welcome, {{name}}!',
      'dashboard.searchPlaceholder': 'Search city...',
      'dashboard.search': 'Search',
      
      // Weather
      'weather.currentWeather': 'Current Weather',
      'weather.forecast': '5-Day Forecast',
      'weather.feelsLike': 'Feels like',
      'weather.humidity': 'Humidity',
      'weather.wind': 'Wind',
      'weather.pressure': 'Pressure',
      'weather.visibility': 'Visibility',
      'weather.sunrise': 'Sunrise',
      'weather.sunset': 'Sunset',
      'weather.loading': 'Loading weather data...',
      'weather.error': 'Failed to load weather data. Please try again.',
      'weather.notFound': 'City not found. Please try another search.',
      
      // Theme & Language
      'theme.dark': 'Dark Mode',
      'theme.light': 'Light Mode',
      'language': 'Language',
      
      // Days
      'days.monday': 'Monday',
      'days.tuesday': 'Tuesday',
      'days.wednesday': 'Wednesday',
      'days.thursday': 'Thursday',
      'days.friday': 'Friday',
      'days.saturday': 'Saturday',
      'days.sunday': 'Sunday',
    }
  },
  fa: {
    translation: {
      // Login Page
      'login.title': 'خوش آمدید به داشبورد آب و هوا',
      'login.subtitle': 'نام خود را وارد کنید',
      'login.nameLabel': 'نام شما',
      'login.namePlaceholder': 'نام خود را وارد کنید',
      'login.submitButton': 'شروع کنید',
      'login.nameRequired': 'نام الزامی است',
      
      // Dashboard
      'dashboard.title': 'داشبورد آب و هوا',
      'dashboard.logout': 'خروج',
      'dashboard.welcome': 'خوش آمدید، {{name}}!',
      'dashboard.searchPlaceholder': 'جستجوی شهر...',
      'dashboard.search': 'جستجو',
      
      // Weather
      'weather.currentWeather': 'آب و هوای فعلی',
      'weather.forecast': 'پیش‌بینی ۵ روزه',
      'weather.feelsLike': 'احساس دما',
      'weather.humidity': 'رطوبت',
      'weather.wind': 'باد',
      'weather.pressure': 'فشار',
      'weather.visibility': 'دید',
      'weather.sunrise': 'طلوع',
      'weather.sunset': 'غروب',
      'weather.loading': 'در حال بارگذاری اطلاعات...',
      'weather.error': 'خطا در بارگذاری اطلاعات. لطفا دوباره تلاش کنید.',
      'weather.notFound': 'شهر یافت نشد. لطفا دوباره جستجو کنید.',
      
      // Theme & Language
      'theme.dark': 'حالت تاریک',
      'theme.light': 'حالت روشن',
      'language': 'زبان',
      
      // Days
      'days.monday': 'دوشنبه',
      'days.tuesday': 'سه‌شنبه',
      'days.wednesday': 'چهارشنبه',
      'days.thursday': 'پنج‌شنبه',
      'days.friday': 'جمعه',
      'days.saturday': 'شنبه',
      'days.sunday': 'یکشنبه',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
