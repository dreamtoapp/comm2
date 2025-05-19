// utils/storage.ts

// Get item with type safety
export const getFromLocalStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;

  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

// Set item with type checking
export const setToLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error setting ${key} to localStorage:`, error);
  }
};

// Remove item
export const removeFromLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

// Clear all
export const clearLocalStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.clear();
};
