import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function JournalPagination({ pagination, onPageChange }) {
  // Safe check if pagination object or required fields are missing
  if (!pagination || !pagination.totalPages || pagination.totalPages <= 1)
    return null;

  // 1. Force everything to a Number to prevent "1" + 1 becoming page "11" string concatenation bug!
  const page = Number(pagination.page) || 1;
  const totalPages = Number(pagination.totalPages);
  const total = pagination.total || 0;

  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6 select-none">
      <p className="text-xs text-slate-500">
        Showing page <span className="text-slate-300 font-medium">{page}</span>{" "}
        of <span className="text-slate-300 font-medium">{totalPages}</span> (
        {total} entries)
      </p>

      <div className="flex items-center gap-2">
        {/* Previous Page Button */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => {
            if (page > 1) onPageChange(page - 1);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Current Page Indicator */}
        <span className="text-xs font-semibold px-2 text-slate-200">
          {page}
        </span>

        {/* Next Page Button */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => {
            if (page < totalPages) onPageChange(page + 1);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
