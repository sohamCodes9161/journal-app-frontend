// src/features/journal/components/FeelingSelector.jsx
import { useState, useEffect } from "react";

const MOODS = [
  { key: "happy", emoji: "😊" },
  { key: "sad", emoji: "😢" },
  { key: "neutral", emoji: "😐" },
  { key: "anxious", emoji: "😰" },
  { key: "excited", emoji: "✨" },
  { key: "angry", emoji: "😡" },
  { key: "grateful", emoji: "🙏" },
  { key: "tired", emoji: "🥱" },
  { key: "reflective", emoji: "🤔" },
];

export default function FeelingSelector({ value, onChange }) {
  const [selected, setSelected] = useState(value || "");

  useEffect(() => {
    setSelected(value || "");
  }, [value]);

  const handleSelect = (key) => {
    setSelected(key);
    if (onChange) onChange(key);
  };

  return (
    <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-medium text-slate-300 select-none">
          How are you feeling today?
        </span>
        {selected && (
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-lg animate-in fade-in zoom-in-95 duration-200">
            {selected}
          </span>
        )}
      </div>

      {/* Pure, Minimalist Emoji Selector Strip */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/40 p-1 rounded-xl border border-white/5">
        {MOODS.map((mood) => {
          const isActive = selected === mood.key;
          return (
            <button
              key={mood.key}
              type="button"
              onClick={() => handleSelect(mood.key)}
              className={`
                w-9 h-9 flex items-center justify-center rounded-lg text-base transition-all duration-200 relative group
                ${
                  isActive
                    ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white scale-105 shadow-md shadow-violet-500/20 font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }
              `}
            >
              <span
                className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "scale-110" : ""}`}
              >
                {mood.emoji}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
