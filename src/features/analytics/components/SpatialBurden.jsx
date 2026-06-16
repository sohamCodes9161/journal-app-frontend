import React from "react";

export const SpatialBurden = ({ distribution }) => {
  const totalOpen =
    (distribution.today || 0) +
    (distribution.week || 0) +
    (distribution.later || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
          Spatial Task Burden
        </h2>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
          {totalOpen} Open
        </span>
      </div>

      <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800/80">
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              label: "Today",
              count: distribution.today,
              color: "text-zinc-100",
            },
            {
              label: "This Week",
              count: distribution.week,
              color: "text-zinc-400",
            },
            {
              label: "Later On",
              count: distribution.later,
              color: "text-zinc-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-zinc-950/40 border border-zinc-800/50 rounded-lg p-3 text-center"
            >
              <span
                className={`text-xl font-semibold tracking-tight block ${item.color}`}
              >
                {item.count || 0}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-zinc-500 text-center mt-4 leading-relaxed">
          Pending items awaiting structural closeout actions.
        </p>
      </div>
    </div>
  );
};
