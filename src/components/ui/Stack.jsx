import { cn } from "@/utils/cn";

export default function Stack({
  children,
  gap = "md",
  className = "",
  ...props
}) {
  const gaps = {
    xs: "gap-2",
    sm: "gap-3",
    md: "gap-5",
    lg: "gap-8",
    xl: "gap-12",
  };

  return (
    <div className={cn("flex flex-col", gaps[gap], className)} {...props}>
      {children}
    </div>
  );
}
