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
        bg-slate-950/90
        backdrop-blur-2xl
        lg:hidden
      "
    >
      {/* Added pb-safe for iPhones with bottom swipe bars */}
      <nav className="flex items-center justify-around px-2 py-3 pb-safe">
        {navigationLinks.map((link) => (
          <NavLinkItem key={link.path} to={link.path}>
            {/* Stack Icon on top, Text on bottom */}
            <div className="flex flex-col items-center gap-1 w-16">
              <span className="text-xl drop-shadow-md mb-0.5">{link.icon}</span>
              <span className="text-[10px] font-medium tracking-wide text-center w-full truncate">
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
