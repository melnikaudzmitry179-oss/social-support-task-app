import i18n from "../i18n/i18n";

/**
 * Utility function to translate text using the i18n instance
 * @param key The translation key
 * @param options Optional interpolation values
 * @returns The translated text
 */
export const t = (key: string, options?: Record<string, unknown>): string => {
  return i18n.t(key, options);
};

/**
 * Get the current language
 * @returns The current language code (e.g., 'en', 'ar')
 */
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

/**
 * Change the current language
 * @param lng The language code to switch to
 */
export const changeLanguage = (lng: string): Promise<unknown> => {
  return i18n.changeLanguage(lng) as Promise<unknown>;
};
