import { useTheme } from "./ThemeContext";

export default function useThemeStyles() {
  const { theme } = useTheme();

  return theme;
}
