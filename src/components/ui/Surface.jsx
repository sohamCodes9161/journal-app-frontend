import { cn } from "@/utils/cn";

export default function Surface({
  children,
  variant = "default",
  elevation = 1,
  glass = false,
  className = "",
  ...props
}) {
  const variants = {
    default:
      "bg-[var(--surface-primary)] border border-[var(--border-default)]",
    secondary:
      "bg-[var(--surface-secondary)] border border-[var(--border-default)]",
    subtle:
      "bg-[var(--background-secondary)] border border-[var(--border-default)]/50",
  };

  const elevations = {
    0: "shadow-none border-none",
    1: "shadow-sm",
    2: "shadow-md border-[var(--border-default)]/80",
    3: "shadow-xl border-[var(--accent-primary)]/20 ring-1 ring-[var(--accent-primary)]/5",
  };

  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-[var(--animation-default,220ms)]",
        variants[variant],
        elevations[elevation],
        glass && "backdrop-blur-xl bg-opacity-70 dark:bg-opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
