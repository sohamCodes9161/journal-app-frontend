import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { THEMES, DEFAULT_THEME } from "./themes";
import { applyTheme } from "./applyTheme";
import useAuth from "@/features/auth/hooks/useAuth";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { user } = useAuth();

  // 1. Instantly use localStorage on reload so it never resets while user context is loading
  const [themeId, setThemeId] = useState(() => {
    const savedLocal = localStorage.getItem("app-theme");
    if (savedLocal && THEMES[savedLocal]) {
      return savedLocal;
    }
    return DEFAULT_THEME;
  });

  // Keep track of a temporary preview theme if desired, otherwise default to themeId
  const [activeThemeId, setActiveThemeId] = useState(themeId);

  // 2. Sync whenever user profile loads/changes from database
  useEffect(() => {
    // If backend returns a legacy "dark" theme, normalize it to "midnight-ink"
    let pref = user?.themePreference;
    if (pref === "dark" || pref === "forest-mist") {
      pref = "midnight-ink";
    }

    if (pref && THEMES[pref]) {
      setThemeId(pref);
      setActiveThemeId(pref);
      localStorage.setItem("app-theme", pref);
    }
  }, [user?.themePreference]);

  const theme = useMemo(() => {
    return THEMES[activeThemeId] || THEMES[themeId] || THEMES[DEFAULT_THEME];
  }, [themeId, activeThemeId]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Permanently commit the theme and save to local storage
  const setTheme = (id) => {
    let targetId = id;
    if (targetId === "dark") targetId = "midnight-ink";

    if (THEMES[targetId]) {
      setThemeId(targetId);
      setActiveThemeId(targetId);
      localStorage.setItem("app-theme", targetId);
    }
  };

  // Preview the theme temporarily without saving to local storage or DB
  const previewTheme = (id) => {
    let targetId = id;
    if (targetId === "dark") targetId = "midnight-ink";

    if (THEMES[targetId]) {
      setActiveThemeId(targetId);
    }
  };

  const resetPreview = () => {
    setActiveThemeId(themeId);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        activeThemeId,
        theme,
        setTheme,
        previewTheme,
        resetPreview,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
