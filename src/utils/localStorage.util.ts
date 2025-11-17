
const dateReviver = (_key: string, value: unknown): unknown => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(value);
  }
  return value;
};

export const getItem = <T>(key: string): T | null => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item, dateReviver) : null;
  } catch (error) {
    console.error(`Error getting item "${key}" from localStorage:`, error);
    return null;
  }
};

export const setItem = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item "${key}" in localStorage:`, error);
  }
};

export const removeItem = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item "${key}" from localStorage:`, error);
  }
};

export const clear = (): void => {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const isSupported = (): boolean => {
   try {
     const testKey = '__localStorage_test';
     window.localStorage.setItem(testKey, testKey);
     window.localStorage.removeItem(testKey);
     return true;
   } catch (error) {
     console.error('localStorage not supported:', error);
     return false;
   }
 };

export const getKeys = (): string[] => {
  try {
    return Object.keys(window.localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};

export const getLength = (): number => {
  try {
    return window.localStorage.length;
  } catch (error) {
    console.error('Error getting localStorage length:', error);
    return 0;
  }
};