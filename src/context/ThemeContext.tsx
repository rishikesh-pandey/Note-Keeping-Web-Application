import React, { createContext, useContext, useEffect } from 'react';
import { Theme } from '../types';
import { useStore } from '../store';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useStore();
  
  // Function to get system preference
  const getSystemPreference = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  
  const [systemPrefersDark, setSystemPrefersDark] = React.useState(getSystemPreference());
  const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);
  
  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    
    // Add listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Update theme when system preference changes (only if theme is 'system')
  useEffect(() => {
    if (theme === 'system') {
      const root = window.document.documentElement;
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme, systemPrefersDark]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};