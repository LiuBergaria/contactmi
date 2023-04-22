import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from 'styled-components';

import THEMES from '../constants/themes';
import { Theme } from '../interfaces/Theme';

// interfaces

type ThemeOption = 'light' | 'dark';

interface ThemeContextData {
  theme: ThemeOption;
  colors: Theme;
  toggleTheme(): void;
}

// create empty theme context object
const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const themeKey = '@ContactMi:theme';
const defaultTheme = 'light';

export const CustomThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<ThemeOption>(defaultTheme);

  /**
   * Loads theme preference from storage
   */
  const loadTheme = useCallback(async () => {
    const loadedTheme = (await AsyncStorage.getItem(themeKey)) as ThemeOption;

    setTheme(loadedTheme || defaultTheme);
  }, []);

  /**
   * Calls loadTheme in initialization
   */
  useEffect(() => {
    loadTheme();
  });

  /**
   * Toggle theme between light and dark
   */
  const toggleTheme = useCallback(async () => {
    setTheme(oldTheme => {
      const newTheme = oldTheme === 'light' ? 'dark' : 'light';

      // save preference in storage
      AsyncStorage.setItem(themeKey, newTheme);

      return newTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: THEMES[theme],
        toggleTheme,
      }}
    >
      <ThemeProvider theme={THEMES[theme]}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextData => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within an CustomThemeProvider');
  }

  return context;
};
