function Navbar() {
  return (
    <header
      className="
        sticky
        top-0
        z-40
        border-b
        border-white/10
        bg-slate-950/40
        backdrop-blur-xl
      "
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div>
          <h1 className="text-sm font-medium text-slate-300">
            Welcome back
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-violet-400/20" />
        </div>
      </div>
    </header>
  );
}

export default Navbar;