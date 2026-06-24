import { useState, useRef, useEffect } from "react";
import { JOURNAL_THEMES, getThemeConfig } from "../../utils/journalThemes";

export default function ThemeSelector({
  currentThemeId,
  onThemeChange,
  theme,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  const currentTheme = theme || getThemeConfig(currentThemeId);

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

  return (
    <div
      ref={popoverRef}
      className="relative inline-block z-30 select-none text-left"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex items-center gap-2
          px-2.5 py-1.5
          rounded-lg
          border
          shadow-sm
          text-xs font-medium
          transition-all duration-300
          ${currentTheme.uiClass}
        `}
      >
        <span
          className="w-3 h-3 rounded-full border border-black/10 shadow-inner inline-block"
          style={{
            backgroundColor: currentTheme.previewBg,
          }}
        />

        <span>
          Atmosphere{" "}
          <strong className="text-violet-500">
            {JOURNAL_THEMES.find((t) => t.id === currentThemeId)?.name}
          </strong>
        </span>

        <span className="text-[9px] opacity-60">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div
          className={`
            absolute left-0 mt-2 w-56
            rounded-xl border
            p-2.5
            shadow-2xl
            backdrop-blur-xl
            animate-fade-in
            transition-colors duration-300
            ${currentTheme.uiClass}
          `}
        >
          <p
            className={`
              text-[10px]
              font-bold
              tracking-wider
              uppercase
              px-1.5
              pb-2
              ${currentTheme.mutedClass}
            `}
          >
            Select Atmosphere
          </p>

          <div className="grid grid-cols-1 gap-1">
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
                  className={`
                    w-full
                    flex items-center gap-3
                    p-1.5
                    rounded-lg
                    border
                    text-left
                    text-xs
                    transition-all duration-200
                    ${
                      isSelected
                        ? "bg-violet-600/15 border-violet-500/30"
                        : "border-transparent"
                    }
                    ${currentTheme.textClass}
                  `}
                >
                  <span
                    className="w-5 h-5 rounded-md border border-black/10 flex-shrink-0"
                    style={{
                      backgroundColor: themeOption.previewBg,
                    }}
                  />

                  <span className="font-medium flex-1 truncate">
                    {themeOption.name}
                  </span>

                  {isSelected && (
                    <span className="text-violet-500 text-[10px]">✓</span>
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
