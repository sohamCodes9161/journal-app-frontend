export const sageGarden = {
  id: "sage-garden",
  name: "Sage Garden",
  isDark: false,
  appearance: "dark",

  description:
    "A serene and refreshing theme inspired by the tranquility of a sage garden, featuring soft greens and earthy tones for a calming workspace. ",

  preview: {
    primary: "#E8F1EB",
    secondary: "#DDE9E1",
    accent: "#60996E",
  },
  tokens: {
    backgroundPrimary: "#E8F1EB",
    backgroundSecondary: "#DDE9E1",
    backgroundTertiary: "#D0E0D5",

    surfacePrimary: "#FCFDFC",
    surfaceSecondary: "#F6FAF7",
    surfaceElevated: "#FFFFFF",
    surfaceFloating: "#FFFFFF",

    textPrimary: "#24352B",
    textSecondary: "#52675A",
    textMuted: "#8B9F91",
    textInverse: "#FFFFFF",

    borderSubtle: "rgba(36,53,43,0.03)",
    borderDefault: "rgba(36,53,43,0.07)",
    borderStrong: "rgba(96,153,110,0.18)",

    accentPrimary: "#60996E",
    accentSecondary: "#82B78E",
    accentHover: "#4D845B",

    success: "#49A86B",
    warning: "#D4A24A",
    danger: "#DB6666",
    info: "#7ABF9A",

    shadowColor: "rgba(110,147,120,0.18)",
    glowColor: "rgba(96,153,110,0.10)",

    overlay: "rgba(20,30,24,0.05)",
    glass: "rgba(255,255,255,0.42)",

    gradientPrimary: "linear-gradient(135deg,#82B78E,#60996E)",

    gradientBackground:
      "linear-gradient(135deg,#F8FCF9 0%,#E8F1EB 35%,#DDE9E1 70%,#D0E0D5 100%)",
  },

  effects: {
    shadowSm: "0 2px 8px rgba(110,147,120,0.08)",
    shadowMd: "0 8px 24px rgba(110,147,120,0.12)",
    shadowLg: "0 20px 48px rgba(110,147,120,0.18)",

    glowPrimary: "0 0 28px rgba(96,153,110,0.10)",

    backdropBlur: "26px",

    pageGradient:
      "linear-gradient(135deg,#F8FCF9 0%,#E8F1EB 35%,#DDE9E1 70%,#D0E0D5 100%)",

    overlay: "rgba(20,30,24,0.05)",
  },

  components: {
    card: {
      background: "var(--surface-primary)",
      border: "var(--border-default)",
      shadow: "0 8px 24px rgba(110,147,120,0.12)",
      radius: "22px",
    },

    button: {
      primaryBackground: "var(--accent-primary)",
      primaryHover: "var(--accent-hover)",
      text: "#FFFFFF",
    },

    input: {
      background: "var(--surface-secondary)",
      border: "var(--border-default)",
    },

    shadow: {
      card: "0 2px 8px rgba(110,147,120,0.08)",
      panel: "0 8px 24px rgba(110,147,120,0.12)",
      popup: "0 20px 48px rgba(110,147,120,0.18)",
      glow: "0 0 28px rgba(96,153,110,0.10)",
    },

    gradient: {
      page: "linear-gradient(135deg,#F8FCF9 0%,#E8F1EB 35%,#DDE9E1 70%,#D0E0D5 100%)",

      card: "linear-gradient(180deg,rgba(255,255,255,0.82) 0%,rgba(255,255,255,0.64) 100%)",

      hero: "linear-gradient(135deg,#82B78E,#60996E)",
    },

    overlay: {
      light: "rgba(255,255,255,0.45)",
      heavy: "rgba(20,30,24,0.25)",
    },

    blur: {
      card: "26px",
      modal: "34px",
    },

    radius: {
      sm: "8px",
      md: "14px",
      lg: "22px",
      xl: "30px",
    },

    animation: {
      quick: "100ms",
      default: "220ms",
      slow: "320ms",
    },
  },

  colors: {
    background: {
      primary: "#E8F1EB",
      secondary: "#DDE9E1",
      tertiary: "#D0E0D5",
    },

    surface: {
      primary: "#FCFDFC",
      secondary: "#F6FAF7",
      elevated: "#FFFFFF",
      floating: "#FFFFFF",
    },

    text: {
      primary: "#24352B",
      secondary: "#52675A",
      muted: "#8B9F91",
      inverse: "#FFFFFF",
    },

    border: {
      subtle: "rgba(36,53,43,0.03)",
      default: "rgba(36,53,43,0.07)",
      strong: "rgba(96,153,110,0.18)",
    },

    accent: {
      primary: "#60996E",
      secondary: "#82B78E",
      success: "#49A86B",
      warning: "#D4A24A",
      danger: "#DB6666",
    },
  },
};
