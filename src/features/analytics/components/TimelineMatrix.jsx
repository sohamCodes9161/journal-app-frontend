import React from "react";
import { useNavigate } from "react-router-dom";

// Standardized colors to adapt nicely in both light/dark modes
const MOOD_THEME_MAP = {
  happy: {
    emoji: "😊",
    color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600",
  },
  sad: {
    emoji: "😢",
    color: "border-blue-500/40 bg-blue-500/10 text-blue-600",
  },
  neutral: {
    emoji: "😐",
    color:
      "border-[var(--border-strong)] bg-[var(--surface-secondary)] text-[var(--text-secondary)]",
  },
  anxious: {
    emoji: "😰",
    color: "border-amber-500/40 bg-amber-500/10 text-amber-600",
  },
  excited: {
    emoji: "🤩",
    color: "border-pink-500/40 bg-pink-500/10 text-pink-600",
  },
  angry: {
    emoji: "😡",
    color: "border-rose-500/40 bg-rose-500/10 text-rose-600",
  },
  grateful: {
    emoji: "🙏",
    color: "border-teal-500/40 bg-teal-500/10 text-teal-600",
  },
  tired: {
    emoji: "🥱",
    color: "border-violet-500/40 bg-violet-500/10 text-violet-600",
  },
  reflective: {
    emoji: "🧘",
    color: "border-indigo-500/40 bg-indigo-500/10 text-indigo-600",
  },
};

export const TimelineMatrix = ({ timeline }) => {
  const navigate = useNavigate();

  const handleDayClick = (day) => {
    if (day.hasJournal) {
      navigate(`/app/journals?date=${day.date}`);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">
        Consistency & Alignment Grid
      </h2>

      <div className="p-6 rounded-2xl bg-[var(--surface-primary)] border border-[var(--border-default)] shadow-sm backdrop-blur-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {timeline.map((day) => {
            const dateObj = new Date(day.date + "T00:00:00");
            const dayName = dateObj.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const dayNum = dateObj.toLocaleDateString("en-US", {
              day: "numeric",
            });

            const moodConfig = MOOD_THEME_MAP[day.mood] || {
              emoji: "📝",
              color:
                "border-[var(--border-subtle)] bg-[var(--surface-secondary)] text-[var(--text-secondary)]",
            };
            const isActive = day.hasJournal || day.completedCount > 0;

            return (
              <button
                key={day.date}
                disabled={!day.hasJournal}
                onClick={() => handleDayClick(day)}
                className={`group rounded-xl p-3.5 border flex flex-col items-center justify-between min-h-[115px] transition-all duration-300 relative ${
                  isActive
                    ? "cursor-pointer active:scale-[0.97]"
                    : "opacity-40 cursor-default"
                } ${day.hasJournal ? moodConfig.color : "bg-[var(--surface-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-default)]"}`}
              >
                {/* Subtle outer glow on hover for logged journal elements */}
                {day.hasJournal && (
                  <div className="absolute inset-0 rounded-xl bg-current opacity-0 group-hover:opacity-[0.04] transition-opacity pointer-events-none" />
                )}

                <div className="text-center">
                  <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest block font-medium">
                    {dayName}
                  </span>
                  <span className="text-sm font-bold tracking-tight text-[var(--text-primary)] block mt-0.5">
                    {dayNum}
                  </span>
                </div>

                {/* Mood Indicator Hub */}
                <div className="my-2.5 text-xl filter drop-shadow-sm h-7 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                  {day.hasJournal ? (
                    moodConfig.emoji
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-strong)]" />
                  )}
                </div>

                {/* Completion Metric Footer */}
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md tracking-wide transition-colors ${
                    day.completedCount > 0
                      ? "text-emerald-600 bg-emerald-500/10 border border-emerald-500/30"
                      : "text-[var(--text-muted)] bg-[var(--surface-elevated)] border border-transparent"
                  }`}
                >
                  {day.completedCount > 0
                    ? `✓ ${day.completedCount} DONE`
                    : "0 DONE"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
