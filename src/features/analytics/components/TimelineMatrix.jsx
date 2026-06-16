import React from "react";

const MOOD_MAP = {
  happy: "😊",
  sad: "😢",
  neutral: "😐",
  anxious: "😰",
  excited: "🤩",
  angry: "😡",
  grateful: "🙏",
  tired: "🥱",
  reflective: "🧘",
};

export const TimelineMatrix = ({ timeline }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
        Consistency & Alignment Grid
      </h2>

      <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800/80">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {timeline.map((day) => {
            const dateObj = new Date(day.date + "T00:00:00");
            const dayName = dateObj.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const dayNum = dateObj.toLocaleDateString("en-US", {
              day: "numeric",
            });

            return (
              <div
                key={day.date}
                className={`rounded-lg p-3 border flex flex-col items-center justify-between min-h-[105px] transition-all duration-200 ${
                  day.hasJournal || day.completedCount > 0
                    ? "bg-zinc-950 border-zinc-700/60 shadow-sm"
                    : "bg-zinc-950/20 border-zinc-800/40 opacity-60"
                }`}
              >
                <div className="text-center">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    {dayName}
                  </span>
                  <span className="text-sm font-semibold text-zinc-300 block">
                    {dayNum}
                  </span>
                </div>

                <div className="my-2 text-xl filter drop-shadow-sm h-6 flex items-center justify-center">
                  {day.hasJournal && day.mood ? (
                    MOOD_MAP[day.mood] || "📝"
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  )}
                </div>

                <span
                  className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                    day.completedCount > 0
                      ? "text-emerald-400 bg-emerald-950/30 border border-emerald-900/30"
                      : "text-zinc-600"
                  }`}
                >
                  {day.completedCount} done
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
