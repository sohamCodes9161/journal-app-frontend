import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui";
import JournalCard from "../components/JournalCard";
import useJournals from "../hooks/useJournals";
import JournalFilters from "../components/JournalFilters";
import JournalPagination from "../components/JournalPagination";

function JournalFeedPage() {
  // 1. Unified Control States for dynamic Lazy Filtering
  const [filters, setFilters] = useState({
    search: "",
    mood: "",
    startDate: "",
    endDate: "",
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [page, setPage] = useState(1);

  // 2. Text input debouncer effect (reduces server computational cost on active typing)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 350);
    return () => clearTimeout(handler);
  }, [filters]);

  // Reset pagination to page 1 whenever search settings are actively changed
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // 3. Connect everything directly into your current hook logic
  const { data, isLoading, isError } = useJournals({
    page,
    limit: 10,
    search: debouncedFilters.search,
    mood: debouncedFilters.mood,
    startDate: debouncedFilters.startDate,
    endDate: debouncedFilters.endDate,
  });

  // Loading State UI Match
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400" />
          <p className="text-sm text-slate-400">
            Gathering your reflections...
          </p>
        </div>
      </div>
    );
  }

  // Error State UI Match
  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-8 py-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white">
            Failed to load journals
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Something interrupted the connection. Please try again.
          </p>
        </div>
      </div>
    );
  }

  // Check if user has filters applied currently
  const hasActiveFilters = Object.values(filters).some((val) => val !== "");
  const hasNoResults = !data || !data.journals || data.journals.length === 0;

  return (
    <div className="space-y-6">
      {/* Top Header Row with Username Avatar Corner Injection */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-4">
        <PageHeader
          title="Your Journals"
          description="Moments, reflections, and thoughts captured over time."
        />
      </div>

      {/* Control Panel Filter Anchor Row */}
      <JournalFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Conditional Rendering Processing Core */}
      {hasNoResults ? (
        hasActiveFilters ? (
          /* Filtered empty state alternative viewport */
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-[32px] bg-white/[0.01] p-8">
            <p className="text-base font-medium text-slate-400">
              No pathways match your filtering parameters
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Try resetting dates, updating text keys, or clearing mood inputs.
            </p>
          </div>
        ) : (
          /* System Baseline Total Empty onboarding State Layout */
          <div className="relative flex min-h-[55vh] flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-8 py-16 text-center backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />
            <div className="relative z-10 max-w-xl">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-3xl backdrop-blur-xl">
                ✨
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Your thoughts will begin to gather here
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                Start writing gently. Every reflection, memory, and feeling
                becomes part of your journey over time.
              </p>
              <Link to="/app/journals/new">
                <Button className="mt-8">Write Your First Journal</Button>
              </Link>
            </div>
          </div>
        )
      ) : (
        /* Render Populated Grid View Container with Lazy Pagination Controls */
        <>
          <div className="grid gap-6">
            {data.journals.map((journal) => (
              <JournalCard key={journal.id || journal._id} journal={journal} />
            ))}
          </div>

          <JournalPagination
            currentPage={page}
            pagination={data.pagination}
            onPageChange={(targetPage) => setPage(targetPage)}
          />
        </>
      )}
    </div>
  );
}

export default JournalFeedPage;
