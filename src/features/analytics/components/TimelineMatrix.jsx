// src/features/analytics/components/TimelineMatrix.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const MOOD_THEME_MAP = {
  happy: {
    emoji: "😊",
    color: "border-emerald-500/30 bg-emerald-950/10 text-emerald-400",
  },
  sad: {
    emoji: "😢",
    color: "border-blue-500/30 bg-blue-950/10 text-blue-400",
  },
  neutral: {
    emoji: "😐",
    color: "border-zinc-700 bg-zinc-900/40 text-zinc-400",
  },
  anxious: {
    emoji: "😰",
    color: "border-amber-500/30 bg-amber-950/10 text-amber-400",
  },
  excited: {
    emoji: "🤩",
    color: "border-pink-500/30 bg-pink-950/10 text-pink-400",
  },
  angry: {
    emoji: "😡",
    color: "border-rose-500/30 bg-rose-950/10 text-rose-400",
  },
  grateful: {
    emoji: "🙏",
    color: "border-teal-500/30 bg-teal-950/10 text-teal-400",
  },
  tired: {
    emoji: "🥱",
    color: "border-violet-500/30 bg-violet-950/10 text-violet-400",
  },
  reflective: {
    emoji: "🧘",
    color: "border-indigo-500/30 bg-indigo-950/10 text-indigo-400",
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
      <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
        Consistency & Alignment Grid
      </h2>

      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm">
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
              color: "border-zinc-800 bg-zinc-950/40 text-zinc-400",
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
                } ${day.hasJournal ? moodConfig.color : "bg-zinc-950/20 border-zinc-800/60 hover:border-zinc-700"}`}
              >
                {/* Subtle outer glow on hover for logged journal elements */}
                {day.hasJournal && (
                  <div className="absolute inset-0 rounded-xl bg-current opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none" />
                )}

                <div className="text-center">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-medium">
                    {dayName}
                  </span>
                  <span className="text-sm font-bold tracking-tight text-zinc-200 block mt-0.5">
                    {dayNum}
                  </span>
                </div>

                {/* Mood Indicator Hub */}
                <div className="my-2.5 text-xl filter drop-shadow-md h-7 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                  {day.hasJournal ? (
                    moodConfig.emoji
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  )}
                </div>

                {/* Completion Metric Footer */}
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md tracking-wide transition-colors ${
                    day.completedCount > 0
                      ? "text-emerald-400 bg-emerald-950/40 border border-emerald-900/30"
                      : "text-zinc-600 bg-zinc-950/30 border border-transparent"
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
