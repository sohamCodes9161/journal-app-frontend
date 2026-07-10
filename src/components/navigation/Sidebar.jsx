import { useState } from "react";
import { navigationLinks } from "./navigationLinks";
import NavLinkItem from "./NavLinkItem";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <aside
      className={`
        hidden
        flex-col
        border-r
        border-[var(--border-default)]
        bg-[var(--surface-primary)]
        backdrop-blur-xl
        transition-all duration-[var(--animation-default,220ms)] ease-in-out
        lg:flex
        ${isCollapsed ? "w-20 items-center" : "w-64 px-4"}
        py-6
      `}
    >
      {/* Header & Toggle Button */}
      <div
        className={`mb-8 flex w-full items-center ${isCollapsed ? "justify-center" : "justify-between px-2"}`}
      >
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              Journal App
            </h2>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Your calm space
            </p>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors border border-[var(--border-default)] cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex w-full flex-col gap-3">
        {navigationLinks.map((link) => (
          <NavLinkItem key={link.path} to={link.path}>
            <div
              className={`flex items-center text-[var(--text-secondary)] ${isCollapsed ? "justify-center w-full" : "gap-3"}`}
            >
              <span className="text-xl drop-shadow-sm">{link.icon}</span>
              {!isCollapsed && (
                <span className="font-medium tracking-wide whitespace-nowrap text-[var(--text-primary)]">
                  {link.label}
                </span>
              )}
            </div>
          </NavLinkItem>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
