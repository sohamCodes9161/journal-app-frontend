import { cn } from "@/utils/cn";

export default function Grid({
  children,
  cols = 1,
  gap = "md",
  className = "",
  ...props
}) {
  const columns = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  const gaps = {
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div
      className={cn(
        "grid",
        columns[cols] || columns[1],
        gaps[gap] || gaps.md,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
