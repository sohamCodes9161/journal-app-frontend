import { navigationLinks } from "./navigationLinks";
import NavLinkItem from "./NavLinkItem";

function MobileNav() {
  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        border-[var(--border-default)]
        bg-[var(--surface-primary)]
        backdrop-blur-2xl
        lg:hidden
      "
      style={{ boxShadow: "var(--shadow-panel)" }}
    >
      <nav className="flex items-center justify-around px-2 py-2 pb-safe">
        {navigationLinks.map((link) => (
          <NavLinkItem key={link.path} to={link.path}>
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-1 w-16 text-center">
                <span
                  className={`text-xl transition-all duration-200 ${
                    isActive
                      ? "scale-110 opacity-100 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                      : "opacity-85 hover:opacity-100"
                  }`}
                >
                  {link.icon}
                </span>
                <span
                  className={`text-[10px] tracking-wide w-full truncate transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--text-primary)] font-semibold"
                      : "text-[var(--text-secondary)] font-normal"
                  }`}
                >
                  {link.label}
                </span>
              </div>
            )}
          </NavLinkItem>
        ))}
      </nav>
    </div>
  );
}

export default MobileNav;
