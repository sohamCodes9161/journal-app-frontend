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
        border-white/10
        bg-slate-950/80
        backdrop-blur-xl
        lg:hidden
      "
    >
      <nav className="flex items-center justify-around p-3">
        {navigationLinks.map((link) => (
          <NavLinkItem key={link.path} to={link.path}>
            {link.label}
          </NavLinkItem>
        ))}
      </nav>
    </div>
  );
}

export default MobileNav;
