// src/features/journal/components/JournalFilters.jsx
import React, { useState, useEffect } from "react";
import { Search, Calendar, Smile, X } from "lucide-react";

export default function JournalFilters({ filters, onFilterChange }) {
  // Local states allow full configuration entry before committing changes to the hook
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [localStartDate, setLocalStartDate] = useState(filters.startDate || "");
  const [localEndDate, setLocalEndDate] = useState(filters.endDate || "");

  // Synced local modifications tracker
  useEffect(() => {
    setLocalSearch(filters.search || "");
    setLocalStartDate(filters.startDate || "");
    setLocalEndDate(filters.endDate || "");
  }, [filters]);

  const handleMoodChange = (e) => {
    onFilterChange({ ...filters, mood: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: localSearch });
  };

  // Only apply dates when BOTH are explicitly filled or both are cleared
  // src/features/journal/components/JournalFilters.jsx

  // ... rest of your component logic stays identical ...

  // Only apply dates when BOTH are explicitly filled or both are cleared
  const applyDateFilter = () => {
    if (
      (localStartDate && localEndDate) ||
      (!localStartDate && !localEndDate)
    ) {
      // 💡 ONLY trigger parent update if the values are actually different from current parent filters
      if (
        localStartDate !== filters.startDate ||
        localEndDate !== filters.endDate
      ) {
        onFilterChange({
          ...filters,
          startDate: localStartDate,
          endDate: localEndDate,
        });
      }
    }
  };

  // Trigger date validation check on local assignment alterations
  useEffect(() => {
    applyDateFilter();
  }, [localStartDate, localEndDate, filters.startDate, filters.endDate]); // Added filters to dependencies Safely

  // Trigger date validation check on local assignment alterations
  useEffect(() => {
    applyDateFilter();
  }, [localStartDate, localEndDate]);

  const clearDates = () => {
    setLocalStartDate("");
    setLocalEndDate("");
    onFilterChange({
      ...filters,
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 p-4 rounded-[24px] backdrop-blur-xl space-y-3">
      {/* Row 1: Search Inputs */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Type your search term here..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/5 focus:border-violet-500/30 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs px-4 py-2 rounded-xl transition shadow-md shadow-violet-600/10 flex items-center gap-1.5 shrink-0"
        >
          Search
        </button>
      </form>

      {/* Row 2: Combined Filter Options */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        {/* Mood Selector (Width Adaptive) */}
        <div className="relative flex-1 sm:max-w-[200px]">
          <Smile className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
          <select
            value={filters.mood || ""}
            onChange={handleMoodChange}
            className="w-full bg-white/5 border border-white/5 focus:border-violet-500/30 rounded-xl pl-9 pr-10 py-2 text-sm text-slate-200 appearance-none outline-none transition cursor-pointer"
          >
            <option value="" className="bg-slate-900 text-slate-400">
              All Moods
            </option>
            <option value="happy" className="bg-slate-900 text-slate-200">
              😊 Happy
            </option>
            <option value="peaceful" className="bg-slate-900 text-slate-200">
              🧘 Peaceful
            </option>
            <option value="sad" className="bg-slate-900 text-slate-200">
              😢 Sad
            </option>
            <option value="anxious" className="bg-slate-900 text-slate-200">
              😰 Anxious
            </option>
            <option value="reflective" className="bg-slate-900 text-slate-200">
              💭 Reflective
            </option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
            ▼
          </div>
        </div>

        {/* Compact, Single-Row Styled Date Range Input */}
        <div className="flex flex-1 items-center gap-2 bg-white/5 border border-white/5 focus-within:border-violet-500/30 rounded-xl px-3 py-1.5 transition">
          <Calendar className="text-slate-500 w-4 h-4 shrink-0" />

          <input
            type="date"
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
            className="bg-transparent text-xs text-slate-200 outline-none w-full cursor-pointer [color-scheme:dark]"
          />

          <span className="text-slate-600 text-xs font-medium px-1">to</span>

          <input
            type="date"
            value={localEndDate}
            min={localStartDate} // Prevents setting an end date earlier than start date
            onChange={(e) => setLocalEndDate(e.target.value)}
            className="bg-transparent text-xs text-slate-200 outline-none w-full cursor-pointer [color-scheme:dark]"
          />

          {(localStartDate || localEndDate) && (
            <button
              type="button"
              onClick={clearDates}
              className="text-slate-500 hover:text-slate-300 transition shrink-0 p-0.5 ml-1"
              title="Clear date range"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
