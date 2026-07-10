import { cn } from "@/utils/cn";

const variants = {
  display: "text-5xl font-bold tracking-tight text-[var(--text-primary)]",
  h1: "text-3xl font-bold tracking-tight text-[var(--text-primary)]",
  h2: "text-2xl font-semibold tracking-tight text-[var(--text-primary)]",
  h3: "text-xl font-semibold text-[var(--text-primary)]",
  body: "text-base text-[var(--text-primary)] leading-7",
  bodySmall: "text-sm text-[var(--text-primary)] leading-6",
  muted: "text-sm text-[var(--text-muted)] leading-6",
  caption: "text-xs uppercase tracking-wider text-[var(--text-muted)]",
};

export default function Typography({
  as,
  variant = "body",
  className = "",
  children,
  ...props
}) {
  const Component =
    as ??
    {
      display: "h1",
      h1: "h1",
      h2: "h2",
      h3: "h3",
      body: "p",
      bodySmall: "p",
      muted: "p",
      caption: "span",
    }[variant];

  return (
    <Component className={cn(variants[variant], className)} {...props}>
      {children}
    </Component>
  );
}
