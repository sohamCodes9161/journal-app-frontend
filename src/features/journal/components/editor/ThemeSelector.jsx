import { useState, useRef, useEffect } from "react";
import { JOURNAL_THEMES, getThemeConfig } from "../../utils/journalThemes";

export default function ThemeSelector({
  currentThemeId,
  onThemeChange,
  theme,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Fallback to empty safe defaults if the theme is loading or undefined
  const currentTheme = theme ||
    getThemeConfig(currentThemeId) || {
      uiClass:
        "bg-slate-50 dark:bg-slate-900 text-slate-700 border-slate-200 dark:border-slate-800",
      previewBg: "#6366f1",
      isDark: false,
    };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeThemeName =
    JOURNAL_THEMES.find((t) => t.id === currentThemeId)?.name || "Default";

  return (
    <div
      ref={popoverRef}
      className="relative inline-block z-30 select-none text-left"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-sm text-xs font-semibold transition-all duration-300 ${currentTheme.uiClass}`}
      >
        <span
          className="w-3 h-3 rounded-full border border-black/10 shadow-inner inline-block shrink-0"
          style={{ backgroundColor: currentTheme.previewBg }}
        />
        <span>
          Atmosphere{" "}
          <strong className="text-violet-600 dark:text-violet-400 font-bold ml-0.5">
            {activeThemeName}
          </strong>
        </span>
        <span className="text-[9px] opacity-60 ml-0.5">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 mt-2 w-56 rounded-2xl border p-2 shadow-2xl z-50 backdrop-blur-xl transition-colors duration-300 ${
            theme.isDark
              ? "bg-[#121115]/95 border-white/10 text-white"
              : "bg-white/95 border-slate-200 text-slate-900"
          }`}
        >
          <p className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-1.5 opacity-60">
            Select Atmosphere
          </p>
          <div
            className="flex flex-col gap-0.5 max-h-60 overflow-y-auto pr-0.5"
            style={{ scrollbarWidth: "thin" }}
          >
            {JOURNAL_THEMES.map((themeOption) => {
              const isSelected = currentThemeId === themeOption.id;

              return (
                <button
                  key={themeOption.id}
                  type="button"
                  onClick={() => {
                    onThemeChange(themeOption.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl text-left text-xs transition-all duration-150 ${
                    isSelected
                      ? "bg-violet-600 text-white font-semibold"
                      : `hover:bg-black/5 dark:hover:bg-white/10 ${
                          theme.isDark ? "text-slate-200" : "text-slate-700"
                        }`
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: themeOption.previewBg }}
                  />
                  <span className="flex-1 truncate">{themeOption.name}</span>
                  {isSelected && (
                    <span className="text-white text-[11px] font-bold">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
