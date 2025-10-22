import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "../src/translations/en.json";
import arTranslation from "../src/translations/ar.json";

i18n
  // .use(Backend) // Temporarily disable Backend as we are importing translations directly
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ar: {
        translation: arTranslation,
      },
    },
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],

      lookupQuerystring: "lng",
      lookupCookie: "i18next",
      lookupLocalStorage: "i18nextLng",

      caches: ["localStorage", "cookie"],
      excludeCacheFor: ["cimode"],

      htmlTag: document.documentElement,
    },
  });

export default i18n;
