import Spinner from "./Spinner";
import { cn } from "@/utils/cn";

function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  fullWidth = false,
  ...props
}) {
  const variants = {
    primary:
      "bg-[var(--accent-primary)] hover:opacity-90 text-white border-none",
    secondary:
      "bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-default)]",
    ghost:
      "hover:bg-[var(--surface-primary)] text-[var(--text-secondary)] border-none",
    danger: "bg-[var(--danger)] hover:opacity-90 text-white border-none",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm rounded-lg",
    md: "h-11 px-5 text-sm rounded-xl",
    lg: "h-12 px-6 text-base rounded-2xl",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-[var(--animation-default,220ms)] cursor-pointer hover:shadow-md active:scale-[0.99]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",
        "focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40",
        fullWidth && "w-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}

export default Button;
