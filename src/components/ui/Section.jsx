import { cn } from "@/utils/cn";
import Surface from "./Surface";

export default function Section({
  title,
  description,
  children,
  className = "",
  variant = "default",
  glass = false,
  ...props
}) {
  return (
    <Surface
      variant={variant}
      glass={glass}
      className={cn("p-6", className)}
      {...props}
    >
      {(title || description) && (
        <div className="mb-5">
          {title && (
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </Surface>
  );
}
