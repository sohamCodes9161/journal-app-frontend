/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background-primary)",
        backgroundSecondary: "var(--background-secondary)",
        backgroundTertiary: "var(--background-tertiary)",

        surface: "var(--surface-primary)",
        surfaceSecondary: "var(--surface-secondary)",
        surfaceElevated: "var(--surface-elevated)",
        surfaceFloating: "var(--surface-floating)",

        surface2: "var(--surface-secondary)",
        surfaceElevatedCustom: "var(--surface-elevated)",

        text: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        text2: "var(--text-secondary)",
        muted: "var(--text-muted)",
        textInverse: "var(--text-inverse)",

        border: "var(--border-default)",
        borderSubtle: "var(--border-subtle)",
        borderStrong: "var(--border-strong)",

        accent: "var(--accent-primary)",
        accentHover: "var(--accent-hover)",
        accentSecondary: "var(--accent-secondary)",

        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      borderRadius: {
        card: "var(--radius-md, 16px)",
        panel: "var(--radius-lg, 22px)",
        modal: "var(--radius-xl, 32px)",
        pill: "9999px",
      },
      boxShadow: {
        sm: "var(--effect-shadow-sm)",
        md: "var(--effect-shadow-md)",
        lg: "var(--effect-shadow-lg)",
        card: "var(--shadow-card)",
        panel: "var(--shadow-panel)",
      },
      backdropBlur: {
        DEFAULT: "var(--effect-backdrop-blur, 18px)",
      },
      transitionDuration: {
        quick: "var(--animation-quick)",
        default: "var(--animation-default)",
        slow: "var(--animation-slow)",
      },
    },
  },
  plugins: [typography],
};
