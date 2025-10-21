import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import enTranslation from './translations/en.json';
import arTranslation from './translations/ar.json';

// Configure i18next
i18n
  .use(Backend)
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      ar: {
        translation: arTranslation
      }
    },
    fallbackLng: 'en', // Default language
    debug: true,
    interpolation: {
      escapeValue: false // React already safes from xss
    },
    detection: {
      // Order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      
      // Keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      
      // Cache user language on
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'], // Languages to not persist (cookie, localStorage)
      
      // Optional htmlTag with lang attribute, the default is:
      htmlTag: document.documentElement
    }
  });

export default i18n;