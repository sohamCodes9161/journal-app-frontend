import { cn } from "@/utils/cn";

function Card({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10",
        "bg-white/5 backdrop-blur-md",
        "shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
