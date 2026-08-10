import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

function NavLinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/app"} // Ensures /app only highlights when exactly on /app
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200",
          "hover:bg-[var(--surface-subtle,rgba(255,255,255,0.05))]",
          isActive
            ? "bg-[var(--surface-elevated,rgba(255,255,255,0.1))] text-[var(--accent-primary,white)] shadow-sm"
            : "text-[var(--text-muted)] opacity-70 hover:opacity-100"
        )
      }
    >
      {({ isActive }) =>
        typeof children === "function" ? children({ isActive }) : children
      }
    </NavLink>
  );
}

export default NavLinkItem;
