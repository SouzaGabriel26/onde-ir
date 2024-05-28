'use client'

import { constants } from "@/utils/constants";
import { createContext, useContext, useEffect, useState } from "react";

export type Theme = 'light' | 'dark';

type ThemeContextProps = {
  theme: Theme,
  handleSetTheme: () => void
}

const ThemeContext = createContext({} as ThemeContextProps);

export function ThemeProvider({ children }: React.PropsWithChildren<{}>) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(constants.themeKey);
    if (storedTheme && ['light', 'dark'].includes(storedTheme)) {
      return storedTheme as Theme;
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem(constants.themeKey, theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  function handleSetTheme() {
    setTheme(previousTheme => (
      previousTheme === 'light' ? 'dark' : 'light'
    ));
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      handleSetTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}


export function useTheme() {
  return useContext(ThemeContext);
}
