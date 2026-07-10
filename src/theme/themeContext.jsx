import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_THEME, THEMES } from "./themes";
import { applyTheme } from "./applyTheme";
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem("app-theme") || DEFAULT_THEME;
  });

  useEffect(() => {
    localStorage.setItem("app-theme", themeId);
  }, [themeId]);

  const theme = THEMES[themeId];

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      themeId,
      setTheme: setThemeId,
    }),
    [theme, themeId]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
