import { cn } from "@/utils/cn";

function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-white/10",
        "bg-white/5 px-4 py-3",
        "text-white placeholder:text-slate-500",
        "outline-none transition-all duration-200",
        "focus:border-violet-400/40 focus:bg-white/7",
        className
      )}
      {...props}
    />
  );
}

export default Input;
