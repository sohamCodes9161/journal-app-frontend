export function getComponentTheme(theme, path) {
  if (!theme || !theme.components) return {};

  // Allows searching for nested entries like 'shadow.card' or just 'card'
  return (
    path.split(".").reduce((acc, part) => acc?.[part], theme.components) ?? {}
  );
}
