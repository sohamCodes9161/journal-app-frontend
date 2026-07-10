import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import { Button, Page, Stack, Section } from "@/components/ui";
import Surface from "@/components/ui/Surface";
import JournalCard from "../components/JournalCard";
import useJournals from "../hooks/useJournals";
import JournalFilters from "../components/JournalFilters";
import JournalPagination from "../components/JournalPagination";
import { getDraftIndex } from "../draftStorage/storage";

function JournalFeedPage() {
  const [searchParams, setSearchParams] = useSearchParams();

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
    updateSearchParam("page", "1");
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

  if (isLoading) {
    return (
      <Page className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[var(--accent-primary)]/30 border-t-[var(--accent-primary)]" />
          <p className="text-sm text-[var(--text-muted)]">
            Gathering your reflections...
          </p>
        </div>
      </Page>
    );
  }

  if (isError) {
    return (
      <Page className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-8 py-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Failed to load journals
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Something interrupted the connection. Please try again.
          </p>
        </div>
      </Page>
    );
  }

  const hasActiveFilters =
    Object.values(filters).some((val) => val !== "") || !!dateParam;
  const hasNoResults = !data || !data.journals || data.journals.length === 0;

  const drafts = getDraftIndex();

  return (
    <Page className="h-full overflow-y-auto pb-28">
      <Stack gap="lg">
        {/* Top Header Row Structure */}
        <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-5 gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <PageHeader
              title="Your Journals"
              description="Moments, reflections, and thoughts captured over time."
            />

            {dateParam && (
              <div className="flex items-center gap-2 self-start rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-3 py-1 text-xs text-[var(--accent-primary)] backdrop-blur-sm">
                <span className="font-mono">Showing Day: {dateParam}</span>
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("date");
                    newParams.set("page", "1");
                    setSearchParams(newParams);
                  }}
                  className="ml-1 font-bold text-[var(--accent-primary)] hover:opacity-80 transition-opacity cursor-pointer"
                  title="Clear day filter"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {drafts.length > 0 && (
              <Link
                to="/app/journals/drafts"
                className="relative p-2.5 rounded-xl bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-default)] transition-colors flex items-center justify-center group"
                title="Manage Drafts"
              >
                <span className="text-xl leading-none">📖</span>
                <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent-primary)] text-white font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center border border-[var(--background-primary)] shadow-md">
                  {drafts.length}
                </span>
              </Link>
            )}

            <Link to="/app/journals/new">
              <Button variant="primary" size="sm">
                <span className="hidden sm:inline">New Journal</span>
                <span className="sm:hidden text-lg font-bold">+</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters Panel Section */}
        <JournalFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Feed Result Evaluation */}
        {hasNoResults ? (
          hasActiveFilters ? (
            <Section
              variant="subtle"
              className="flex min-h-[40vh] flex-col items-center justify-center text-center p-8 border-dashed"
            >
              <p className="text-base font-medium text-[var(--text-muted)]">
                No pathways match your filtering parameters
              </p>
            </Section>
          ) : (
            <Section className="relative flex min-h-[55vh] flex-col items-center justify-center overflow-hidden px-8 py-16 text-center">
              <div className="relative z-10 max-w-xl">
                <h2 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                  Your thoughts will begin to gather here
                </h2>
                <Link to="/app/journals/new">
                  <Button variant="primary">Write Your First Journal</Button>
                </Link>
              </div>
            </Section>
          )
        ) : (
          <>
            <div className="grid gap-6">
              {data.journals.map((journal) => (
                <JournalCard
                  key={journal.id || journal._id}
                  journal={journal}
                />
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
      </Stack>
    </Page>
  );
}

export default JournalFeedPage;
