import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function JournalPagination({ pagination, onPageChange }) {
  // Safe check if pagination object or required fields are missing
  if (!pagination || !pagination.totalPages || pagination.totalPages <= 1)
    return null;

  // Force everything to a Number to prevent "1" + 1 string concatenation bug!
  const page = Number(pagination.page) || 1;
  const totalPages = Number(pagination.totalPages);
  const total = pagination.total || 0;

  return (
    <div
      style={{ borderColor: "var(--border-subtle)" }}
      className="flex items-center justify-between border-t pt-6 mt-6 select-none"
    >
      <p style={{ color: "var(--text-muted)" }} className="text-xs">
        Showing page{" "}
        <span
          style={{ color: "var(--text-primary)" }}
          className="font-semibold"
        >
          {page}
        </span>{" "}
        of{" "}
        <span
          style={{ color: "var(--text-primary)" }}
          className="font-semibold"
        >
          {totalPages}
        </span>{" "}
        ({total} entries)
      </p>

      <div className="flex items-center gap-2">
        {/* Previous Page Button */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => {
            if (page > 1) onPageChange(page - 1);
          }}
          style={{
            backgroundColor: "var(--overlay-light, rgba(0, 0, 0, 0.02))",
            borderColor: "var(--border-default)",
            color: "var(--text-primary)",
          }}
          className="w-9 h-9 flex items-center justify-center rounded-xl border transition-all cursor-pointer hover:bg-[var(--surface-secondary)] hover:border-[var(--accent-primary)]/40 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />{" "}
          {/* Made Chevron bolder */}
        </button>

        {/* Current Page Indicator */}
        <span
          style={{ color: "var(--text-primary)" }}
          className="text-xs font-bold px-2.5"
        >
          {page}
        </span>

        {/* Next Page Button */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => {
            if (page < totalPages) onPageChange(page + 1);
          }}
          style={{
            backgroundColor: "var(--overlay-light, rgba(0, 0, 0, 0.02))",
            borderColor: "var(--border-default)",
            color: "var(--text-primary)",
          }}
          className="w-9 h-9 flex items-center justify-center rounded-xl border transition-all cursor-pointer hover:bg-[var(--surface-secondary)] hover:border-[var(--accent-primary)]/40 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />{" "}
          {/* Made Chevron bolder */}
        </button>
      </div>
    </div>
  );
}
