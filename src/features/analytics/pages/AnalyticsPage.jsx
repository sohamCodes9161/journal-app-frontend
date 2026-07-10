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
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--accent-primary)]" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] animate-pulse">
          Synthesizing performance models...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-4 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-center">
        <p className="font-mono text-xs text-[var(--danger)]">{error}</p>
      </div>
    );
  }

  const { summary, mindset, spatialDistribution, timeline } = data;

  return (
    /* 
      1. h-full: Ensures the container fills the available layout space.
      2. overflow-y-auto: Enables internal scrolling when content exceeds height.
      3. pb-24: Provides extra bottom padding to prevent the fixed nav from hiding content.
    */
    <div className="h-full overflow-y-auto px-4 py-8 pb-24 text-[var(--text-primary)] antialiased selection:bg-[var(--accent-primary)]/30">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER CONTROLS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Workspace Insights
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Behavioral analysis, execution velocity, and mental resonance
              tracking.
            </p>
          </div>

          {/* Premium Segmented Controls */}
          <div className="flex items-center self-start sm:self-center bg-[var(--surface-secondary)] border border-[var(--border-subtle)] p-1 rounded-xl shadow-inner backdrop-blur-md">
            <button
              onClick={() => setRange("week")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                range === "week"
                  ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-sm border border-[var(--border-default)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setRange("month")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                range === "month"
                  ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-sm border border-[var(--border-default)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
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
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-default)] backdrop-blur-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] block font-bold">
                Execution Velocity Map
              </span>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Visualizing task clearance throughput ratio relative to priority
                focus targets.
              </p>
            </div>

            {/* Elegant SVG Native Trendline Visualization */}
            <div className="h-24 w-full mt-4 flex items-end relative px-2">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--accent-primary, #8b5cf6)"
                      stopOpacity="0.25"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--accent-primary, #8b5cf6)"
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0,30 L 0,${30 - (summary.completionRate || 40) / 4} Q 30,${30 - (summary.northStarSuccessRate || 50) / 4.5} 60,${25 - (summary.completionRate || 40) / 5} T 100,${30 - (summary.northStarSuccessRate || 50) / 3.8} L 100,30 Z`}
                  fill="url(#velocityGrad)"
                />
                <path
                  d={`M 0,${30 - (summary.completionRate || 40) / 4} Q 30,${30 - (summary.northStarSuccessRate || 50) / 4.5} 60,${25 - (summary.completionRate || 40) / 5} T 100,${30 - (summary.northStarSuccessRate || 50) / 3.8}`}
                  fill="none"
                  stroke="var(--accent-primary, #a78bfa)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex justify-between pointer-events-none items-center opacity-10">
                <div className="w-full h-[1px] bg-[var(--text-primary)]" />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)] mt-2">
              <span>START OF PERIOD</span>
              <span className="text-[var(--text-secondary)] font-semibold text-xs">
                Clearance Cap: {summary.completionRate || 0}%
              </span>
              <span>CURRENT HORIZON</span>
            </div>
          </div>
        </div>

        {/* CONTINUOUS BEHAVIORAL ALIGNMENT GRID */}
        <TimelineMatrix timeline={timeline} />
      </div>
    </div>
  );
};
