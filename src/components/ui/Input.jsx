import { cn } from "@/utils/cn";

function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full h-11 rounded-xl border border-[var(--border-default)]",
        "bg-[var(--surface-primary)] px-4 text-sm",
        "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
        "outline-none transition-all duration-[var(--animation-default,220ms)]",
        "focus:border-[var(--accent-primary)]/50 focus:bg-[var(--surface-secondary)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export default Input;
