import { cn } from "@/utils/cn";

export default function Page({ children, className = "", ...props }) {
  return (
    <div
      className={cn(
        "min-h-full w-full max-w-full min-w-0 overflow-x-hidden px-3 sm:px-6 py-4 sm:py-8 text-[var(--text-primary)] transition-colors duration-[var(--animation-default,220ms)] box-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
