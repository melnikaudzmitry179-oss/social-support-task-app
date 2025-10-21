/**
 * Utility functions for working with LocalStorage API
 */

/**
 * Custom reviver function to handle Date objects during JSON parsing
 */
const dateReviver = (key: string, value: unknown): unknown => {
  // Check if the value is a string that matches the date format (YYYY-MM-DD)
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(value);
  }
  return value;
};

/**
 * Get an item from localStorage
 * @param key The key of the item to retrieve
 * @returns The value stored at the key, or null if not found or if parsing fails
 */
export const getItem = <T>(key: string): T | null => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item, dateReviver) : null;
  } catch (error) {
    console.error(`Error getting item "${key}" from localStorage:`, error);
    return null;
  }
};

/**
 * Set an item in localStorage
 * @param key The key to store the item under
 * @param value The value to store
 */
export const setItem = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item "${key}" in localStorage:`, error);
  }
};

/**
 * Remove an item from localStorage
 * @param key The key of the item to remove
 */
export const removeItem = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item "${key}" from localStorage:`, error);
  }
};

/**
 * Clear all items from localStorage
 */
export const clear = (): void => {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Check if localStorage is supported in the current environment
 * @returns Boolean indicating whether localStorage is supported
 */
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

/**
 * Get all keys stored in localStorage
 * @returns Array of all keys in localStorage
 */
export const getKeys = (): string[] => {
  try {
    return Object.keys(window.localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};

/**
 * Get the number of items stored in localStorage
 * @returns The number of items in localStorage
 */
export const getLength = (): number => {
  try {
    return window.localStorage.length;
  } catch (error) {
    console.error('Error getting localStorage length:', error);
    return 0;
  }
};