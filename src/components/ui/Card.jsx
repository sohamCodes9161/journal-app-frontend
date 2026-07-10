import { cn } from "@/utils/cn";

export default function Card({
  children,
  className = "",
  elevation = "base",
  padding = "none",
  hover = false,
  ...props
}) {
  // 1. Cleaned up elevation styles to rely on your CSS variables instead of hardcoded Tailwind bg classes
  const elevationStyles = {
    flat: "bg-transparent border-transparent",
    base: "border-[var(--card-border,var(--border-default))]",
    raised: "border-[var(--card-border,var(--border-default))]",
    floating: "border-[var(--border-strong)]",
    glass: "border-[var(--border-subtle)]",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  // 2. Resolve background based on elevation
  let activeBackground = "var(--card-background, var(--surface-primary))";
  if (elevation === "raised") activeBackground = "var(--surface-secondary)";
  if (elevation === "floating") activeBackground = "var(--surface-floating)";
  if (elevation === "glass") activeBackground = "var(--glass)"; // Fixed! --glass is actually in your theme tokens

  // 3. Resolve shadows
  let activeShadow = "var(--card-shadow, var(--shadow-card, none))";
  if (elevation === "floating" || hover)
    activeShadow = "var(--shadow-popup, none)";

  return (
    <div
      {...props}
      className={cn(
        "transition-all duration-[var(--animation-default,220ms)] text-[var(--text-primary)] border",
        elevationStyles[elevation],
        paddings[padding],
        hover
          ? "hover:-translate-y-1 hover:border-[var(--accent-secondary)] cursor-pointer"
          : "",
        className
      )}
      style={{
        // Now exclusively consuming the CSS variables your applyTheme function generates!
        background: activeBackground,
        borderRadius: "var(--card-radius, var(--radius-md, 16px))",
        boxShadow: activeShadow,
        backdropFilter:
          elevation === "glass" ? "blur(var(--blur-card, 16px))" : "none",
      }}
    >
      {children}
    </div>
  );
}
