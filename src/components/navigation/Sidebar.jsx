import { navigationLinks } from "./navigationLinks";

import NavLinkItem from "./NavLinkItem";

function Sidebar() {
  return (
    <aside
      className="
        hidden
        w-72
        flex-col
        border-r
        border-white/10
        bg-white/5
        p-4
        backdrop-blur-xl
        lg:flex
      "
    >
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold">Journal App</h2>

        <p className="mt-1 text-sm text-slate-400">Your calm digital space</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navigationLinks.map((link) => (
          <NavLinkItem key={link.path} to={link.path}>
            {link.label}
          </NavLinkItem>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
