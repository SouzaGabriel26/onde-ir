'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { constants } from '@/utils/constants';

export type Theme = 'light' | 'dark';

type ThemeContextProps = {
  theme: Theme;
  handleToggleTheme: () => void;
};

const ThemeContext = createContext({} as ThemeContextProps);

export function ThemeProvider({ children }: React.PropsWithChildren<{}>) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (document !== undefined) {
      const localTheme = localStorage.getItem(constants.themeKey) ?? '';

      updateDocumentTheme(localTheme);

      setTheme(localStorage.getItem(constants.themeKey) as Theme);
    }
  }, []);

  function updateDocumentTheme(theme: string) {
    if (['dark', 'light'].includes(theme)) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      localStorage.setItem(constants.themeKey, 'light');
    }
  }

  function handleToggleTheme() {
    const toggledTheme = theme === 'light' ? 'dark' : 'light';

    setTheme(toggledTheme);

    localStorage.setItem(constants.themeKey, toggledTheme);

    if (toggledTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        handleToggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
