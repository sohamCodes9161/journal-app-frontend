import Spinner from "./Spinner";

import { cn } from "@/utils/cn";

function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  ...props
}) {
  const variants = {
    primary: "bg-violet-500 hover:bg-violet-400 text-white",

    secondary:
      "bg-white/10 hover:bg-white/15 text-white border border-white/10",

    ghost: "hover:bg-white/10 text-slate-300",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus:outline-none focus:ring-2 focus:ring-violet-400/40",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && <Spinner />}

      {children}
    </button>
  );
}

export default Button;
