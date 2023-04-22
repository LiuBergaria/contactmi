import React, { createContext, useCallback, useState, useContext } from 'react';
import { ThemeProvider } from 'styled-components';

// interfaces
interface ThemeContextData {
  theme: 'light' | 'dark';
  colors: {
    primary: string;
    background: string;
    foreground: string;
    background2: string;
    foreground2: string;
  };
  toggleTheme(): void;
}

const lightTheme = {
  primary: '#e0245e',
  background: '#ffffff',
  foreground: '#202020',
  background2: '#f2f2f2',
  foreground2: '#99a1a6',
};

const darkTheme = {
  primary: '#e0245e',
  background: '#202020',
  foreground: '#e3e3e3',
  background2: '#272727',
  foreground2: '#99a1a6',
};

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const CustomThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const themeFromStorage = localStorage.getItem('@ContactMi:theme');

    let themeSelected = themeFromStorage || 'light';

    if (themeFromStorage !== 'light' && themeFromStorage !== 'dark') {
      themeSelected = 'light';

      localStorage.setItem('@ContactMi:theme', themeSelected);
    }

    return themeSelected as 'light' | 'dark';
  });

  const toggleTheme = useCallback(() => {
    setTheme(oldTheme => {
      const newTheme = oldTheme === 'light' ? 'dark' : 'light';

      localStorage.setItem('@ContactMi:theme', newTheme);

      return newTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: theme === 'light' ? lightTheme : darkTheme,
        toggleTheme,
      }}
    >
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        {children}
      </ThemeProvider>
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
