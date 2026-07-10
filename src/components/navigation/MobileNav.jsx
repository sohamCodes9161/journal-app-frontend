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
      <nav className="flex items-center justify-around px-2 py-3 pb-safe">
        {navigationLinks.map((link) => (
          <NavLinkItem key={link.path} to={link.path}>
            <div className="flex flex-col items-center gap-1 w-16 text-[var(--text-secondary)]">
              <span className="text-xl drop-shadow-sm mb-0.5">{link.icon}</span>
              <span className="text-[10px] font-medium tracking-wide text-center w-full truncate text-[var(--text-muted)]">
                {link.label}
              </span>
            </div>
          </NavLinkItem>
        ))}
      </nav>
    </div>
  );
}

export default MobileNav;
