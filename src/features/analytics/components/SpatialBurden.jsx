// src/features/analytics/components/SpatialBurden.jsx
import React from "react";

export const SpatialBurden = ({ distribution }) => {
  const today = distribution?.today || 0;
  const week = distribution?.week || 0;
  const later = distribution?.later || 0;
  const totalOpen = today + week + later;

  // Calculate percentages for the stacked visualization strip
  const todayPct = totalOpen > 0 ? (today / totalOpen) * 100 : 0;
  const weekPct = totalOpen > 0 ? (week / totalOpen) * 100 : 0;
  const laterPct = totalOpen > 0 ? (later / totalOpen) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
          Cognitive Overhead
        </h2>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/50 font-bold">
          {totalOpen} Active Items
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-4">
        {/* Stacked Proportional Distribution Track */}
        <div className="h-2 w-full rounded-full bg-zinc-950 overflow-hidden flex">
          <div
            style={{ width: `${todayPct}%` }}
            className="h-full bg-zinc-100 transition-all duration-500"
            title="Today"
          />
          <div
            style={{ width: `${weekPct}%` }}
            className="h-full bg-zinc-400 transition-all duration-500"
            title="This Week"
          />
          <div
            style={{ width: `${laterPct}%` }}
            className="h-full bg-zinc-700 transition-all duration-500"
            title="Later"
          />
        </div>

        {/* Compact Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-2.5 text-center">
            <span className="text-lg font-bold tracking-tight block text-zinc-100">
              {today}
            </span>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wide block mt-0.5">
              Today
            </span>
          </div>
          <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-2.5 text-center">
            <span className="text-lg font-bold tracking-tight block text-zinc-400">
              {week}
            </span>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wide block mt-0.5">
              Week
            </span>
          </div>
          <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-2.5 text-center">
            <span className="text-lg font-bold tracking-tight block text-zinc-600">
              {later}
            </span>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wide block mt-0.5">
              Later
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
