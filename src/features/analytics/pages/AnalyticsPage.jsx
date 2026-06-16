import React from "react";
import { useNavigate } from "react-router-dom";
import { useAnalytics } from "../hooks/useAnalytics";

const MOOD_EMOJIS = {
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

export const AnalyticsPage = () => {
  const { range, setRange, data, isLoading, error } = useAnalytics("week");
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-8 text-center font-mono text-xs text-zinc-500 uppercase tracking-widest">
        Loading metrics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-900/30 font-mono text-xs text-rose-400">
        {error}
      </div>
    );
  }

  const { summary, mindset, spatialDistribution, timeline } = data;

  // Click handler to redirect user to a specific day's journal entry
  const handleDayClick = (day) => {
    if (day.hasJournal) {
      // Redirects to your journal page with a date query parameter
      navigate(`/app/journals?date=${day.date}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 text-zinc-100 antialiased">
      {/* HEADER CONTROLS */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Workspace Analytics
          </h1>
          <p className="text-xs text-zinc-500">
            Performance tracking and reflection insights.
          </p>
        </div>

        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setRange("week")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${range === "week" ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            7 Days
          </button>
          <button
            onClick={() => setRange("month")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${range === "month" ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* SECTION 1: INTENTIONS & TASKS ANALYSIS */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-semibold">
          Task Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-zinc-900 border border-zinc-800/80 rounded-xl">
            <span className="text-[11px] text-zinc-400 block font-medium">
              Completion Rate
            </span>
            <span className="text-2xl font-semibold text-emerald-400 mt-1 block">
              {summary.completionRate || 0}%
            </span>
          </div>
          <div className="p-4 bg-zinc-900 border border-zinc-800/80 rounded-xl">
            <span className="text-[11px] text-zinc-400 block font-medium">
              North Star Focus
            </span>
            <span className="text-2xl font-semibold text-indigo-400 mt-1 block">
              {summary.northStarSuccessRate}%
            </span>
          </div>
          <div className="p-4 bg-zinc-900 border border-zinc-800/80 rounded-xl">
            <span className="text-[11px] text-zinc-400 block font-medium">
              Avg. Task Lifespan
            </span>
            <span className="text-2xl font-semibold text-amber-400 mt-1 block">
              {summary.avgTaskLifespanDays || 0}{" "}
              <span className="text-xs text-zinc-500 font-normal">days</span>
            </span>
          </div>
          <div className="p-4 bg-zinc-900 border border-zinc-800/80 rounded-xl">
            <span className="text-[11px] text-zinc-400 block font-medium">
              Pending Backlog
            </span>
            <span className="text-2xl font-semibold text-zinc-300 mt-1 block">
              {spatialDistribution.today +
                spatialDistribution.week +
                spatialDistribution.later || 0}{" "}
              <span className="text-xs text-zinc-500 font-normal">items</span>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: JOURNAL & REFLECTION VISUAL ACTIVITY GRAPH */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-semibold">
            Journal Activity & Moods
          </h2>
          <div className="text-xs text-zinc-400 font-medium">
            Dominant Baseline:{" "}
            <span className="text-indigo-400 capitalize font-semibold">
              {mindset.dominantMood}
            </span>
          </div>
        </div>

        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
          {/* Calendar Heatmap Strip Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {timeline.map((day) => {
              const parsedDate = new Date(day.date + "T00:00:00");
              const dayLabel = parsedDate.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
              });

              return (
                <button
                  key={day.date}
                  disabled={!day.hasJournal}
                  onClick={() => handleDayClick(day)}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between min-h-[90px] transition-all ${
                    day.hasJournal
                      ? "bg-zinc-950 border-zinc-700 hover:border-zinc-500 cursor-pointer shadow-sm active:scale-[0.98]"
                      : "bg-zinc-950/40 border-zinc-800/60 cursor-default opacity-50"
                  }`}
                >
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight block">
                    {dayLabel}
                  </span>

                  {/* Visual Indicator Layer */}
                  <div className="my-1.5 text-lg flex items-center justify-start min-h-[24px]">
                    {day.hasJournal ? (
                      MOOD_EMOJIS[day.mood] || "📝"
                    ) : (
                      <span className="w-1 h-1 rounded-full bg-zinc-800 ml-1" />
                    )}
                  </div>

                  <span className="text-[9px] font-mono tracking-wide text-zinc-400 uppercase">
                    {day.completedCount > 0
                      ? `✓ ${day.completedCount} Tasks`
                      : "0 Tasks"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
