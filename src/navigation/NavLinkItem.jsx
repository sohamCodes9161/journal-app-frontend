import { NavLink } from "react-router-dom";

import { cn } from "@/utils/cn";

function NavLinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
          "hover:bg-white/10",
          isActive
            ? "bg-white/10 text-white"
            : "text-slate-400"
        )
      }
    >
      {children}
    </NavLink>
  );
}

export default NavLinkItem;