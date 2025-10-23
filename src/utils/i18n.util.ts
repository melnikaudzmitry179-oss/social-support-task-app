import i18n from "../i18n/i18n";

export const t = (key: string, options?: Record<string, unknown>): string => {
  return i18n.t(key, options);
};

export const getCurrentLanguage = (): string => {
  return i18n.language;
};

export const changeLanguage = (lng: string): Promise<unknown> => {
  return i18n.changeLanguage(lng) as Promise<unknown>;
};
