export function applyTheme(theme) {
  console.log("Applying active theme object:", theme);
  const root = document.documentElement;

  if (!theme) return;

  const tokens = theme.tokens || {};
  const colors = theme.colors || {};

  function camelToKebab(str) {
    return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
  }

  // 1. Process Advanced Tokens Map
  if (theme.tokens) {
    Object.entries(theme.tokens).forEach(([key, value]) => {
      root.style.setProperty(`--${camelToKebab(key)}`, value);
    });
  }

  // 2. Fallbacks for Old Schema bindings
  if (colors.background) {
    root.style.setProperty("--background-primary", colors.background.primary);
    root.style.setProperty(
      "--background-secondary",
      colors.background.secondary
    );
    root.style.setProperty("--background-tertiary", colors.background.tertiary);
  }
  if (colors.surface) {
    root.style.setProperty("--surface-primary", colors.surface.primary);
    root.style.setProperty("--surface-secondary", colors.surface.secondary);
    root.style.setProperty("--surface-elevated", colors.surface.elevated);
    root.style.setProperty("--surface-floating", colors.surface.floating);
  }
  if (colors.text) {
    root.style.setProperty("--text-primary", colors.text.primary);
    root.style.setProperty("--text-secondary", colors.text.secondary);
    root.style.setProperty("--text-muted", colors.text.muted);
    root.style.setProperty("--text-inverse", colors.text.inverse);
  }
  if (colors.border) {
    root.style.setProperty("--border-subtle", colors.border.subtle);
    root.style.setProperty("--border-default", colors.border.default);
    root.style.setProperty("--border-strong", colors.border.strong);
  }
  if (colors.accent) {
    root.style.setProperty("--accent-primary", colors.accent.primary);
    root.style.setProperty("--accent-secondary", colors.accent.secondary);
    root.style.setProperty("--success", colors.accent.success);
    root.style.setProperty("--warning", colors.accent.warning);
    root.style.setProperty("--danger", colors.accent.danger);
  }

  // 3. Shadows & Atmosphere Glows
  root.style.setProperty("--shadow-card", theme.shadow?.card || "none");
  root.style.setProperty("--shadow-panel", theme.shadow?.panel || "none");
  root.style.setProperty("--shadow-popup", theme.shadow?.popup || "none");
  root.style.setProperty("--shadow-glow", theme.shadow?.glow || "none");

  // 4. Page & Layout Gradients
  root.style.setProperty(
    "--gradient-page",
    theme.gradient?.page ||
      tokens.gradientBackground ||
      colors.background?.primary
  );
  root.style.setProperty(
    "--gradient-card",
    theme.gradient?.card || tokens.surfacePrimary || colors.surface?.primary
  );
  root.style.setProperty(
    "--gradient-hero",
    theme.gradient?.hero || tokens.gradientPrimary || colors.accent?.primary
  );

  // 5. Glass Blurs & Overlays
  root.style.setProperty(
    "--overlay-light",
    theme.overlay?.light || "rgba(255,255,255,.04)"
  );
  root.style.setProperty(
    "--overlay-heavy",
    theme.overlay?.heavy || "rgba(0,0,0,.45)"
  );
  root.style.setProperty("--blur-card", theme.blur?.card || "16px");
  root.style.setProperty("--blur-modal", theme.blur?.modal || "24px");

  // 6. Structure Radii & Animations
  root.style.setProperty("--radius-sm", theme.radius?.sm || "8px");
  root.style.setProperty("--radius-md", theme.radius?.md || "12px");
  root.style.setProperty("--radius-lg", theme.radius?.lg || "16px");
  root.style.setProperty("--radius-xl", theme.radius?.xl || "24px");

  root.style.setProperty(
    "--animation-quick",
    theme.animation?.quick || "150ms"
  );
  root.style.setProperty(
    "--animation-default",
    theme.animation?.default || "200ms"
  );
  root.style.setProperty("--animation-slow", theme.animation?.slow || "300ms");

  // Component-specific theme variables
  Object.entries(theme.components || {}).forEach(
    ([componentName, componentValues]) => {
      Object.entries(componentValues).forEach(([property, value]) => {
        root.style.setProperty(
          `--${componentName}-${camelToKebab(property)}`,
          value
        );
      });
    }
  );

  // Effects configuration mapping
  Object.entries(theme.effects || {}).forEach(([key, value]) => {
    root.style.setProperty(`--effect-${camelToKebab(key)}`, value);
  });
}
