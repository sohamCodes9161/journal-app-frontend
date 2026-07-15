// src/components/settings/ThemeSelector.jsx
import { useEffect, useRef } from "react";
import { THEMES } from "@/theme/themes/index";
import { useTheme } from "@/theme/ThemeProvider";
import { applyTheme } from "@/theme/applyTheme";

export default function ThemeSelector({ value, onChange }) {
  const { themeId } = useTheme();
  const initialThemeId = useRef(themeId);

  // If the saved global theme changes externally, update our ref
  useEffect(() => {
    initialThemeId.current = themeId;
  }, [themeId]);

  // Cleanup effect: If the component unmounts (navigating away),
  // restore the CSS variables to the official saved theme.
  useEffect(() => {
    return () => {
      if (THEMES[initialThemeId.current]) {
        applyTheme(THEMES[initialThemeId.current]);
      }
    };
  }, []);

  const handlePreview = (id) => {
    // 1. Sync parent form data
    onChange(id);

    // 2. Directly apply visual variables for immediate screen-wide preview
    if (THEMES[id]) {
      applyTheme(THEMES[id]);
    }
  };

  return (
    <div className="space-y-2">
      {Object.entries(THEMES).map(([id, theme]) => {
        const selected = value === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => handlePreview(id)}
            className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 transition-all cursor-pointer ${
              selected
                ? "border-accent bg-surface"
                : "border-border hover:border-accent/40 hover:bg-surface"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected ? "border-accent" : "border-border"
                }`}
              >
                {selected && <div className="w-2 h-2 rounded-full bg-accent" />}
              </div>

              <span className="text-sm font-medium text-text">
                {theme.name || id}
              </span>
            </div>

            <div className="flex gap-1.5">
              <div
                className="w-5 h-5 rounded-md border"
                style={{
                  background:
                    theme.tokens?.backgroundPrimary ||
                    theme.colors?.background?.primary,
                  borderColor:
                    theme.tokens?.borderDefault ||
                    theme.colors?.border?.default,
                }}
              />
              <div
                className="w-5 h-5 rounded-md border"
                style={{
                  background:
                    theme.tokens?.surfacePrimary ||
                    theme.colors?.surface?.primary,
                  borderColor:
                    theme.tokens?.borderDefault ||
                    theme.colors?.border?.default,
                }}
              />
              <div
                className="w-5 h-5 rounded-md"
                style={{
                  background:
                    theme.tokens?.accentPrimary ||
                    theme.colors?.accent?.primary,
                }}
              />
              <div
                className="w-5 h-5 rounded-md"
                style={{
                  background:
                    theme.tokens?.accentSecondary ||
                    theme.colors?.accent?.secondary,
                }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
