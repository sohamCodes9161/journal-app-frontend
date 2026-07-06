import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import { Button } from "@/components/ui";
import JournalCard from "../components/JournalCard";
import useJournals from "../hooks/useJournals";
import JournalFilters from "../components/JournalFilters";
import JournalPagination from "../components/JournalPagination";

function JournalFeedPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read parameters strictly from the URL string as our Single Source of Truth
  const dateParam = searchParams.get("date") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [filters, setFilters] = useState({
    search: "",
    mood: "",
    startDate: "",
    endDate: "",
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 350);
    return () => clearTimeout(handler);
  }, [filters]);

  const updateSearchParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    updateSearchParam("page", "1"); // Reset to page 1 safely when user alters filter fields
  };

  const journalParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: debouncedFilters.search,
      mood: debouncedFilters.mood,
      startDate: debouncedFilters.startDate,
      endDate: debouncedFilters.endDate,
      date: dateParam,
    }),
    [page, debouncedFilters, dateParam]
  );

  const { data, isLoading, isError } = useJournals(journalParams);

  // 1. Restored original loading state with spinner
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

  // 2. Restored original error banner block
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

  const hasActiveFilters =
    Object.values(filters).some((val) => val !== "") || !!dateParam;
  const hasNoResults = !data || !data.journals || data.journals.length === 0;

  return (
    <div className="h-full overflow-y-auto px-4 pb-28 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-5">
        <div className="flex flex-col gap-2">
          <PageHeader
            title="Your Journals"
            description="Moments, reflections, and thoughts captured over time."
          />

          {/* 3. Restored showing day date badge pill block */}
          {dateParam && (
            <div className="flex items-center gap-2 self-start rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-300 backdrop-blur-sm">
              <span className="font-mono">Showing Day: {dateParam}</span>
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete("date");
                  newParams.set("page", "1");
                  setSearchParams(newParams);
                }}
                className="ml-1 font-bold text-violet-400 hover:text-violet-200 transition-colors cursor-pointer"
                title="Clear day filter"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* 4. Restored "+ Create New Journal" navigation button */}
        <Link to="/app/journals/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-violet-500/10 transition-all active:scale-[0.98]">
            + Create New Journal
          </Button>
        </Link>
      </div>

      <JournalFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* 5. Restored original aesthetic empty states */}
      {hasNoResults ? (
        hasActiveFilters ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-[32px] bg-white/[0.01] p-8">
            <p className="text-base font-medium text-slate-400">
              No pathways match your filtering parameters
            </p>
          </div>
        ) : (
          <div className="relative flex min-h-[55vh] flex-col items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-8 py-16 text-center backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />
            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Your thoughts will begin to gather here
              </h2>
              <Link to="/app/journals/new">
                <Button className="mt-8">Write Your First Journal</Button>
              </Link>
            </div>
          </div>
        )
      ) : (
        <>
          <div className="grid gap-6">
            {data.journals.map((journal) => (
              <JournalCard key={journal.id || journal._id} journal={journal} />
            ))}
          </div>

          <JournalPagination
            currentPage={page}
            pagination={data.pagination}
            onPageChange={(targetPage) =>
              updateSearchParam("page", targetPage.toString())
            }
          />
        </>
      )}
    </div>
  );
}

export default JournalFeedPage;
