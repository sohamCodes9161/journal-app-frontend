import React from "react";

export const AnalyticsSummary = ({ summary, mindset }) => {
  const getLifespanInsight = (days) => {
    if (!days || days === 0) return "No operational lag detected.";
    if (days < 1)
      return "Outstanding execution velocity. You clear tasks almost immediately.";
    if (days <= 3)
      return "Healthy turnaround. Your items resolve within a manageable window.";
    return "High operational drag. Lingering items are creating mental background noise.";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
        Core Performance Drivers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800/80 flex flex-col justify-between min-h-[140px]">
          <span className="text-zinc-400 text-xs font-medium tracking-wide">
            North Star Focus
          </span>
          <div className="my-2">
            <span className="text-4xl font-semibold tracking-tight text-emerald-400">
              {summary.northStarSuccessRate}%
            </span>
          </div>
          <span className="text-[11px] text-zinc-500">
            Completion accuracy on pinned priority items.
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800/80 flex flex-col justify-between min-h-[140px]">
          <span className="text-zinc-400 text-xs font-medium tracking-wide">
            Intention Lifespan
          </span>
          <div className="my-2 flex items-baseline gap-1">
            <span className="text-4xl font-semibold tracking-tight text-amber-400">
              {summary.avgTaskLifespanDays || 0}
            </span>
            <span className="text-xs font-mono text-zinc-500 uppercase">
              days
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 italic line-clamp-1">
            "{getLifespanInsight(summary.avgTaskLifespanDays)}"
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800/80 flex flex-col justify-between min-h-[140px]">
          <span className="text-zinc-400 text-xs font-medium tracking-wide">
            Dominant Resonance
          </span>
          <div className="my-2">
            <span className="text-3xl font-medium capitalize tracking-tight text-indigo-400">
              {mindset.dominantMood}
            </span>
          </div>
          <span className="text-[11px] text-zinc-500">
            Primary baseline across {mindset.journalCount} active entries.
          </span>
        </div>
      </div>
    </div>
  );
};
