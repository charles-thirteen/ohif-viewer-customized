import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ThemeValue = 'DENTAL' | 'RADIOLOGY';

const THEME_STORAGE_KEY = 'user-preferred-theme';

interface ThemeContextValue {
  theme: ThemeValue;
  setTheme: React.Dispatch<React.SetStateAction<ThemeValue>>;
}

const themeContext = createContext<ThemeContextValue | null>(null);
const { Provider } = themeContext;

export const useTheme = () => useContext<ThemeContextValue>(themeContext as any);

function getPersistedTheme(): ThemeValue {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'DENTAL' || stored === 'RADIOLOGY') {
      return stored;
    }
  } catch {
    // localStorage may be unavailable
  }
  return 'RADIOLOGY';
}

export function ThemeContextProvider({ children }: React.PropsWithChildren) {
  const [theme, setThemeState] = useState<ThemeValue>(getPersistedTheme);

  const setTheme: React.Dispatch<React.SetStateAction<ThemeValue>> = useCallback((value) => {
    setThemeState(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // localStorage may be unavailable
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'DENTAL') {
      root.classList.add('dental-theme');
    } else {
      root.classList.remove('dental-theme');
    }
  }, [theme]);

  return <Provider value={{ theme, setTheme }}>{children}</Provider>;
}

export default ThemeContextProvider;
