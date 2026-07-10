import { cn } from "@/utils/cn";

export default function Page({ children, className = "", ...props }) {
  return (
    <main
      className={cn(
        "min-h-full w-full px-6 py-8 text-[var(--text-primary)] transition-colors duration-[var(--animation-default,220ms)]",
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}
