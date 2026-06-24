import { createContext, useContext } from "react";

const JournalThemeContext = createContext(null);

export function JournalThemeProvider({ theme, children }) {
  return (
    <JournalThemeContext.Provider value={theme}>
      {children}
    </JournalThemeContext.Provider>
  );
}

export function useJournalTheme() {
  const theme = useContext(JournalThemeContext);

  if (!theme) {
    throw new Error("useJournalTheme must be used inside JournalThemeProvider");
  }

  return theme;
}
