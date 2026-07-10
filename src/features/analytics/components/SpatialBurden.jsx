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
        <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-bold">
          Cognitive Overhead
        </h2>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] font-bold">
          {totalOpen} Active Items
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-default)] space-y-4 shadow-sm">
        {/* Stacked Proportional Distribution Track */}
        <div className="h-2 w-full rounded-full bg-[var(--surface-elevated)] overflow-hidden flex border border-[var(--border-subtle)]">
          <div
            style={{ width: `${todayPct}%` }}
            className="h-full bg-[var(--accent-primary)] transition-all duration-500"
            title="Today"
          />
          <div
            style={{ width: `${weekPct}%` }}
            className="h-full bg-[var(--text-secondary)] transition-all duration-500 opacity-60"
            title="This Week"
          />
          <div
            style={{ width: `${laterPct}%` }}
            className="h-full bg-[var(--text-muted)] transition-all duration-500 opacity-30"
            title="Later"
          />
        </div>

        {/* Compact Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-[var(--surface-primary)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-center">
            <span className="text-lg font-bold tracking-tight block text-[var(--text-primary)]">
              {today}
            </span>
            <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wide block mt-0.5">
              Today
            </span>
          </div>
          <div className="bg-[var(--surface-primary)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-center">
            <span className="text-lg font-bold tracking-tight block text-[var(--text-secondary)]">
              {week}
            </span>
            <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wide block mt-0.5">
              Week
            </span>
          </div>
          <div className="bg-[var(--surface-primary)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-center">
            <span className="text-lg font-bold tracking-tight block text-[var(--text-muted)]">
              {later}
            </span>
            <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wide block mt-0.5">
              Later
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
