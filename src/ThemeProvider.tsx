import React, { ReactNode, createContext, useContext, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
}

interface ThemeContextType {
  theme: Theme;
}

const theme: Theme = {
  colors: {
    primary: '#4ecdc4',
    secondary: '#ff6b6b',
    accent: '#ffeaa7',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: 'rgba(255, 255, 255, 0.9)',
    text: '#2d3748',
    textSecondary: '#4a5568',
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', '#667eea');
    root.style.setProperty('--bg-secondary', '#764ba2');
    root.style.setProperty('--text-primary', '#2d3748');
    root.style.setProperty('--text-secondary', '#4a5568');
  }, []);

  const contextValue: ThemeContextType = {
    theme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};