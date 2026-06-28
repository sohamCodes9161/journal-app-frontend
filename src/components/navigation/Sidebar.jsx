import { useState } from "react";
import { navigationLinks } from "./navigationLinks";
import NavLinkItem from "./NavLinkItem";

function Sidebar() {
  // State to manage whether the sidebar is compressed or expanded
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <aside
      className={`
        hidden
        flex-col
        border-r
        border-white/10
        bg-slate-950/40
        backdrop-blur-xl
        transition-all duration-300 ease-in-out
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
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Journal App
            </h2>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
              Your calm space
            </p>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5"
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
              className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-3"}`}
            >
              <span className="text-xl drop-shadow-md">{link.icon}</span>
              {!isCollapsed && (
                <span className="font-medium tracking-wide whitespace-nowrap">
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
