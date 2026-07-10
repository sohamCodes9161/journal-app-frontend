export const sakuraMist = {
  id: "sakura-mist",
  name: "Sakura Mist",
  isDark: false,
  appearance: "dark",

  description:
    "A soft and elegant theme inspired by the delicate beauty of cherry blossoms, featuring gentle pinks and muted tones for a serene workspace.",

  preview: {
    primary: "#F8EFF2",
    secondary: "#F4E6EB",
    accent: "#D66F8F",
  },

  tokens: {
    // Backgrounds
    backgroundPrimary: "#F8EFF2",
    backgroundSecondary: "#F4E6EB",
    backgroundTertiary: "#EFDCE3",

    // Surfaces (Saturated to be distinctly pinkish, removing the flat whitish wash)
    surfacePrimary: "#FAECF0",
    surfaceSecondary: "#F5DFE5",
    surfaceElevated: "#FCE2E9",
    surfaceFloating: "#FAD6E0",

    // Text
    textPrimary: "#3B2A33",
    textSecondary: "#6A5360",
    textMuted: "#A48D98",
    textInverse: "#FFFFFF",

    // Borders
    borderSubtle: "rgba(214,111,143,0.06)",
    borderDefault: "rgba(214,111,143,0.12)",
    borderStrong: "rgba(214,111,143,0.22)",

    // Accent
    accentPrimary: "#D66F8F",
    accentSecondary: "#E48FA8",
    accentHover: "#C45577",

    success: "#55B37B",
    warning: "#E2A641",
    danger: "#E25C72",
    info: "#D889C4",

    shadowColor: "rgba(214,111,143,0.16)",
    glowColor: "rgba(214,111,143,0.12)",

    overlay: "rgba(214,111,143,0.06)",
    glass: "rgba(250,236,240,0.65)",

    gradientPrimary: "linear-gradient(135deg,#E48FA8,#D66F8F)",

    gradientBackground:
      "linear-gradient(135deg,#FFF8FA 0%,#F8EFF2 30%,#F4E6EB 65%,#EFDCE3 100%)",
  },

  effects: {
    shadowSm: "0 2px 10px rgba(214,111,143,0.08)",
    shadowMd: "0 10px 28px rgba(214,111,143,0.12)",
    shadowLg: "0 22px 52px rgba(214,111,143,0.18)",

    glowPrimary: "0 0 30px rgba(214,111,143,0.14)",

    backdropBlur: "26px",

    pageGradient:
      "linear-gradient(135deg,#FFF8FA 0%,#F8EFF2 30%,#F4E6EB 65%,#EFDCE3 100%)",

    overlay: "rgba(214,111,143,0.06)",
  },

  components: {
    card: {
      background: "var(--surface-primary)",
      border: "var(--border-default)",
      shadow: "0 10px 28px rgba(214,111,143,0.12)",
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
      card: "0 2px 10px rgba(214,111,143,0.08)",
      panel: "0 10px 28px rgba(214,111,143,0.12)",
      popup: "0 22px 52px rgba(214,111,143,0.18)",
      glow: "0 0 30px rgba(214,111,143,0.14)",
    },

    gradient: {
      page: "linear-gradient(135deg,#FFF8FA 0%,#F8EFF2 30%,#F4E6EB 65%,#EFDCE3 100%)",

      card: "linear-gradient(180deg,#FCE2E9 0%,#FAECF0 100%)",

      hero: "linear-gradient(135deg,#E48FA8,#D66F8F)",
    },

    overlay: {
      light: "rgba(250,236,240,0.55)",
      heavy: "rgba(214,111,143,0.18)",
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
      primary: "#F8EFF2",
      secondary: "#F4E6EB",
      tertiary: "#EFDCE3",
    },

    surface: {
      primary: "#FAECF0",
      secondary: "#F5DFE5",
      elevated: "#FCE2E9",
      floating: "#FAD6E0",
    },

    text: {
      primary: "#3B2A33",
      secondary: "#6A5360",
      muted: "#A48D98",
      inverse: "#FFFFFF",
    },

    border: {
      subtle: "rgba(214,111,143,0.06)",
      default: "rgba(214,111,143,0.12)",
      strong: "rgba(214,111,143,0.22)",
    },

    accent: {
      primary: "#D66F8F",
      secondary: "#E48FA8",
      success: "#55B37B",
      warning: "#E2A641",
      danger: "#E25C72",
    },
  },
};
