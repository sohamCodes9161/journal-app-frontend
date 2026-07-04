// src/features/analytics/pages/AnalyticsPage.jsx
import React from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import { AnalyticsSummary } from "../components/AnalyticsSummary";
import { SpatialBurden } from "../components/SpatialBurden";
import { TimelineMatrix } from "../components/TimelineMatrix";

export const AnalyticsPage = () => {
  const { range, setRange, data, isLoading, error } = useAnalytics("week");

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 animate-pulse">
          Synthesizing performance models...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 text-center">
        <p className="font-mono text-xs text-rose-400">{error}</p>
      </div>
    );
  }

  const { summary, mindset, spatialDistribution, timeline } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-zinc-100 antialiased selection:bg-violet-500/30">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Workspace Insights
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Behavioral analysis, execution velocity, and mental resonance
            tracking.
          </p>
        </div>

        {/* Premium Segmented Controls */}
        <div className="flex items-center self-start sm:self-center bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl shadow-inner backdrop-blur-md">
          <button
            onClick={() => setRange("week")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
              range === "week"
                ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setRange("month")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
              range === "month"
                ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* CORE PERFORMANCE METRICS MODULE */}
      <AnalyticsSummary summary={summary} mindset={mindset} />

      {/* GRID LAYOUT: COGNITIVE BURDEN & ANALYTICS TREND LINES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SpatialBurden distribution={spatialDistribution} />
        </div>

        {/* Dynamic Visual Distribution Canvas */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block font-bold">
              Execution Velocity Map
            </span>
            <p className="text-xs text-zinc-400 mt-1">
              Visualizing task clearance throughput ratio relative to priority
              focus targets.
            </p>
          </div>

          {/* Elegant SVG Native Trendline Visualization (Zero External Dependencies) */}
          <div className="h-24 w-full mt-4 flex items-end relative px-2">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Dynamic background path area */}
              <path
                d={`M 0,30 L 0,${30 - (summary.completionRate || 40) / 4} Q 30,${30 - (summary.northStarSuccessRate || 50) / 4.5} 60,${25 - (summary.completionRate || 40) / 5} T 100,${30 - (summary.northStarSuccessRate || 50) / 3.8} L 100,30 Z`}
                fill="url(#velocityGrad)"
              />
              {/* Sharp accent stroke line */}
              <path
                d={`M 0,${30 - (summary.completionRate || 40) / 4} Q 30,${30 - (summary.northStarSuccessRate || 50) / 4.5} 60,${25 - (summary.completionRate || 40) / 5} T 100,${30 - (summary.northStarSuccessRate || 50) / 3.8}`}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex justify-between pointer-events-none items-center opacity-10">
              <div className="w-full h-[1px] bg-zinc-100" />
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-3 border-t border-zinc-800/50 mt-2">
            <span>START OF PERIOD</span>
            <span className="text-zinc-400 font-semibold text-xs">
              Clearance Cap: {summary.completionRate || 0}%
            </span>
            <span>CURRENT HORIZON</span>
          </div>
        </div>
      </div>

      {/* CONTINUOUS BEHAVIORAL ALIGNMENT GRID */}
      <TimelineMatrix timeline={timeline} />
    </div>
  );
};
