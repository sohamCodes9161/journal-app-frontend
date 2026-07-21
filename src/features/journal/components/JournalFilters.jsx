import React, { useState, useEffect } from "react";
import { Search, Calendar, Smile, X } from "lucide-react";
import { Button, Section } from "@/components/ui";
import Input from "@/components/ui/Input";

export default function JournalFilters({ filters, onFilterChange }) {
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [localStartDate, setLocalStartDate] = useState(filters.startDate || "");
  const [localEndDate, setLocalEndDate] = useState(filters.endDate || "");

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

  const applyDateFilter = () => {
    if (
      (localStartDate && localEndDate) ||
      (!localStartDate && !localEndDate)
    ) {
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
    <Section
      variant="secondary"
      className="p-3 sm:p-4 space-y-3 w-full max-w-full overflow-hidden"
    >
      {/* Row 1: Search Inputs */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
          <Input
            type="text"
            placeholder="Type your search term here..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 w-full text-sm"
          />
        </div>
        <Button type="submit" size="sm" className="shrink-0">
          Search
        </Button>
      </form>

      {/* Row 2: Combined Filter Options */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1 w-full min-w-0">
        {/* Mood Selector */}
        <div className="relative w-full sm:w-auto sm:min-w-[160px] sm:max-w-[200px] shrink-0">
          <Smile className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4 pointer-events-none" />
          <select
            value={filters.mood || ""}
            onChange={handleMoodChange}
            className="w-full h-11 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] pl-10 pr-10 text-sm text-[var(--text-primary)] appearance-none outline-none transition-all focus:border-[var(--accent-primary)]/50 focus:bg-[var(--surface-secondary)] cursor-pointer"
          >
            <option
              value=""
              className="bg-[var(--surface-secondary)] text-[var(--text-muted)]"
            >
              All Moods
            </option>
            <option
              value="happy"
              className="bg-[var(--surface-primary)] text-[var(--text-primary)]"
            >
              😊 Happy
            </option>
            <option
              value="peaceful"
              className="bg-[var(--surface-primary)] text-[var(--text-primary)]"
            >
              🧘 Peaceful
            </option>
            <option
              value="sad"
              className="bg-[var(--surface-primary)] text-[var(--text-primary)]"
            >
              😢 Sad
            </option>
            <option
              value="anxious"
              className="bg-[var(--surface-primary)] text-[var(--text-primary)]"
            >
              😰 Anxious
            </option>
            <option
              value="reflective"
              className="bg-[var(--surface-primary)] text-[var(--text-primary)]"
            >
              💭 Reflective
            </option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)] text-xs">
            ▼
          </div>
        </div>

        {/* Date Picker Input Group Range - Mobile Responsive with min-w-0 */}
        <div className="flex flex-1 items-center justify-between min-w-0 w-full h-11 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] focus-within:border-[var(--accent-primary)]/50 focus-within:bg-[var(--surface-secondary)] px-2.5 sm:px-3.5 transition-all">
          <Calendar className="text-[var(--text-muted)] w-4 h-4 shrink-0 mr-1" />

          {/* Start Date */}
          <input
            type="date"
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
            className="bg-transparent text-[11px] sm:text-xs text-[var(--text-primary)] outline-none min-w-0 flex-1 cursor-pointer [color-scheme:dark] dark:[color-scheme:dark] light:[color-scheme:light]"
          />

          <span className="text-[var(--text-muted)] text-[10px] sm:text-xs font-medium px-1 shrink-0">
            to
          </span>

          {/* End Date */}
          <input
            type="date"
            value={localEndDate}
            min={localStartDate}
            onChange={(e) => setLocalEndDate(e.target.value)}
            className="bg-transparent text-[11px] sm:text-xs text-[var(--text-primary)] outline-none min-w-0 flex-1 cursor-pointer [color-scheme:dark] dark:[color-scheme:dark] light:[color-scheme:light]"
          />

          {(localStartDate || localEndDate) && (
            <button
              type="button"
              onClick={clearDates}
              className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition shrink-0 p-1 ml-1 cursor-pointer"
              title="Clear date range"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>
    </Section>
  );
}
