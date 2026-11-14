"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  ThemeName,
  DEFAULT_THEME,
  getStoredTheme,
  storeTheme,
  applyTheme,
} from "./theme";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (next: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(DEFAULT_THEME);

  // On mount, restore the saved preference. The inline script in the
  // root layout has already applied it before first paint, so this
  // mainly syncs React state with what is on <html>.
  useEffect(() => {
    const saved = getStoredTheme();
    setThemeState(saved);
    applyTheme(saved);
  }, []);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
    storeTheme(next);
    applyTheme(next);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
