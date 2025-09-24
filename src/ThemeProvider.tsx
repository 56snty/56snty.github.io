import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

interface Theme {
  isDark: boolean;
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
  toggleTheme: () => void;
}

const lightTheme: Theme = {
  isDark: false,
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

const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: '#4ecdc4',
    secondary: '#ff6b6b',
    accent: '#ffeaa7',
    background: 'radial-gradient(ellipse at center, #0f0f23 0%, #000000 100%)',
    surface: 'rgba(15, 15, 35, 0.9)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
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
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark));

    // Update CSS custom properties for theme switching
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-primary', '#0f0f23');
      root.style.setProperty('--bg-secondary', '#1a1a2e');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.8)');
    } else {
      root.style.setProperty('--bg-primary', '#667eea');
      root.style.setProperty('--bg-secondary', '#764ba2');
      root.style.setProperty('--text-primary', '#2d3748');
      root.style.setProperty('--text-secondary', '#4a5568');
    }
  }, [isDark]);

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};