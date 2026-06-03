export const JOURNAL_THEMES = {
  "cosmic-dark": {
    name: "Cosmic Depth",
    pageBg:
      "bg-[linear-gradient(to_bottom,rgba(15,23,42,0.85),rgba(0,0,0,0.95)),url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center bg-no-repeat bg-fixed",
    textStyle: "font-sans tracking-wide text-indigo-100",
    accentGlow: "from-indigo-500/10 via-transparent to-purple-500/10",
    editorCanvas: "bg-slate-950/40 border-indigo-500/10 backdrop-blur-xl",
  },
  "floral-sanctuary": {
    name: "Floral Sanctuary",
    // 🌸 This applies a gorgeous vintage dark flower background texture across the entire screen
    pageBg:
      "bg-[linear-gradient(to_bottom,rgba(24,24,27,0.75),rgba(24,24,27,0.9)),url('https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center bg-no-repeat bg-fixed",
    textStyle: "font-serif tracking-normal text-rose-100/90 leading-relaxed",
    accentGlow: "from-rose-500/10 via-transparent to-fuchsia-500/10",
    editorCanvas: "bg-zinc-900/50 border-rose-500/20 backdrop-blur-xl",
  },
  "warm-parchment": {
    name: "Warm Sanctuary",
    pageBg:
      "bg-[linear-gradient(to_bottom,rgba(28,25,23,0.85),rgba(9,9,11,0.95)),url('https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center bg-no-repeat bg-fixed",
    textStyle: "font-serif tracking-normal text-amber-100/90 leading-relaxed",
    accentGlow: "from-amber-500/5 via-transparent to-orange-500/5",
    editorCanvas: "bg-stone-900/40 border-amber-500/10 backdrop-blur-md",
  },
  "minimal-matte": {
    name: "Minimal Canvas",
    pageBg: "bg-neutral-950",
    textStyle: "font-sans tracking-tight text-slate-200",
    accentGlow: "opacity-0",
    editorCanvas: "bg-neutral-900 border-white/5",
  },
};
