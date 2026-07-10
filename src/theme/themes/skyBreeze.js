export const skyBreeze = {
  id: "sky-breeze",
  name: "Sky Breeze",
  isDark: false,
  appearance: "light blue",

  description:
    "A light and airy theme inspired by the clear blue sky, featuring soft blues and whites for a refreshing workspace.",

  preview: {
    primary: "#EBF5FA",
    secondary: "#DFEFF7",
    accent: "#87CEEB",
  },

  tokens: {
    backgroundPrimary: "#EBF5FA",
    backgroundSecondary: "#DFEFF7",
    backgroundTertiary: "#D1E6F2",

    surfacePrimary: "#FDFEFF",
    surfaceSecondary: "#F5FAFD",
    surfaceElevated: "#FFFFFF",
    surfaceFloating: "#FFFFFF",

    textPrimary: "#1A2F3D",
    textSecondary: "#496475",
    textMuted: "#829FA8",
    textInverse: "#FFFFFF",

    borderSubtle: "rgba(26,47,61,0.03)",
    borderDefault: "rgba(26,47,61,0.07)",
    borderStrong: "rgba(135,206,235,0.22)",

    accentPrimary: "#87CEEB",
    accentSecondary: "#A6DDF0",
    accentHover: "#6AB9D9",

    success: "#52B788",
    warning: "#F4A261",
    danger: "#E76F51",
    info: "#75C6E6",

    shadowColor: "rgba(106,164,196,0.18)",
    glowColor: "rgba(135,206,235,0.15)",

    overlay: "rgba(15,25,35,0.05)",
    glass: "rgba(255,255,255,0.45)",

    gradientPrimary: "linear-gradient(135deg,#A6DDF0,#87CEEB)",

    gradientBackground:
      "linear-gradient(135deg,#F8FCFE 0%,#EBF5FA 35%,#DFEFF7 70%,#D1E6F2 100%)",
  },

  effects: {
    shadowSm: "0 2px 8px rgba(106,164,196,0.08)",
    shadowMd: "0 8px 24px rgba(106,164,196,0.12)",
    shadowLg: "0 20px 48px rgba(106,164,196,0.18)",

    glowPrimary: "0 0 28px rgba(135,206,235,0.15)",

    backdropBlur: "26px",

    pageGradient:
      "linear-gradient(135deg,#F8FCFE 0%,#EBF5FA 35%,#DFEFF7 70%,#D1E6F2 100%)",

    overlay: "rgba(15,25,35,0.05)",
  },

  components: {
    card: {
      background: "var(--surface-primary)",
      border: "var(--border-default)",
      shadow: "0 8px 24px rgba(106,164,196,0.12)",
      radius: "22px",
    },

    button: {
      primaryBackground: "var(--accent-primary)",
      primaryHover: "var(--accent-hover)",
      text: "#1A2F3D" /* Sky blue buttons often need darker text for contrast, or you can keep this #FFFFFF if your fonts are bold */,
    },

    input: {
      background: "var(--surface-secondary)",
      border: "var(--border-default)",
    },

    shadow: {
      card: "0 2px 8px rgba(106,164,196,0.08)",
      panel: "0 8px 24px rgba(106,164,196,0.12)",
      popup: "0 20px 48px rgba(106,164,196,0.18)",
      glow: "0 0 28px rgba(135,206,235,0.15)",
    },

    gradient: {
      page: "linear-gradient(135deg,#F8FCFE 0%,#EBF5FA 35%,#DFEFF7 70%,#D1E6F2 100%)",

      card: "linear-gradient(180deg,rgba(255,255,255,0.85) 0%,rgba(255,255,255,0.65) 100%)",

      hero: "linear-gradient(135deg,#A6DDF0,#87CEEB)",
    },

    overlay: {
      light: "rgba(255,255,255,0.50)",
      heavy: "rgba(15,25,35,0.25)",
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
      primary: "#EBF5FA",
      secondary: "#DFEFF7",
      tertiary: "#D1E6F2",
    },

    surface: {
      primary: "#FDFEFF",
      secondary: "#F5FAFD",
      elevated: "#FFFFFF",
      floating: "#FFFFFF",
    },

    text: {
      primary: "#1A2F3D",
      secondary: "#496475",
      muted: "#829FA8",
      inverse: "#FFFFFF",
    },

    border: {
      subtle: "rgba(26,47,61,0.03)",
      default: "rgba(26,47,61,0.07)",
      strong: "rgba(135,206,235,0.22)",
    },

    accent: {
      primary: "#87CEEB",
      secondary: "#A6DDF0",
      success: "#52B788",
      warning: "#F4A261",
      danger: "#E76F51",
    },
  },
};
