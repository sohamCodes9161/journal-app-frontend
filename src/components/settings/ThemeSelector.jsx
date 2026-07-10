import { THEMES } from "@/theme/themes/index";
import { useTheme } from "@/theme/ThemeProvider";

export default function ThemeSelector({ value, onChange }) {
  const { setTheme } = useTheme();

  return (
    <div className="space-y-2">
      {Object.values(THEMES).map((theme) => {
        const selected = value === theme.id;

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => {
              onChange(theme.id);
              setTheme(theme.id);
            }}
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
                {theme.name}
              </span>
            </div>

            <div className="flex gap-1.5">
              <div
                className="w-5 h-5 rounded-md border"
                style={{
                  background: theme.tokens.backgroundPrimary,
                  borderColor: theme.tokens.borderDefault,
                }}
              />

              <div
                className="w-5 h-5 rounded-md border"
                style={{
                  background: theme.tokens.surfacePrimary,
                  borderColor: theme.tokens.borderDefault,
                }}
              />

              <div
                className="w-5 h-5 rounded-md"
                style={{
                  background: theme.tokens.accentPrimary,
                }}
              />

              <div
                className="w-5 h-5 rounded-md"
                style={{
                  background: theme.tokens.accentSecondary,
                }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
