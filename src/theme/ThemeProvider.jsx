// src/theme/ThemeProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { THEMES, DEFAULT_THEME } from "./themes";
import { applyTheme } from "./applyTheme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem("theme") || DEFAULT_THEME;
  });

  // 1. Move the theme definition to the top
  const theme = useMemo(() => {
    let activeId = themeId;

    if (activeId === "forest-mist") {
      activeId = "pure-cirrus";
    }

    if (!THEMES[activeId]) {
      console.error(`Theme ID "${activeId}" was not found in THEMES registry!`);
      return THEMES[DEFAULT_THEME];
    }
    return THEMES[activeId];
  }, [themeId]);

  // 2. Now use 'theme' in the useEffect hooks placed BELOW the definition
  useEffect(() => {
    console.log("Triggering applyTheme with:", theme.id);
    applyTheme(theme);
    localStorage.setItem("theme", theme.id);
  }, [theme]); // Consolidated logic into one effect

  function setTheme(id) {
    setThemeId(id);
  }

  const value = {
    themeId,
    setTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useTheme must be executed within a ThemeProvider wrapper!"
    );
  }
  return context;
}
