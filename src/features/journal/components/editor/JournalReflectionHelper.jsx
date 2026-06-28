// src/features/journal/components/editor/JournalReflectionHelper.jsx
import { useState } from "react";
import { useTodos } from "@/features/todos/hooks/useTodos";

export default function JournalReflectionHelper({ onInsertMention, theme }) {
  const { data: separatedTodos, isLoading } = useTodos();
  const fulfilledItems = separatedTodos?.completedToday || [];

  const [isOpen, setIsOpen] = useState(false);
  const [usedTodoIds, setUsedTodoIds] = useState(new Set());

  const visibleItems = fulfilledItems.filter(
    (item) => !usedTodoIds.has(item._id)
  );

  if (isLoading || visibleItems.length === 0) return null;

  return (
    <div className="w-full transition-all duration-500 ease-in-out z-10 relative">
      {!isOpen ? (
        /* ── Collapsed trigger button ── */
        <div className="flex justify-start px-1">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`
              group flex items-center gap-2
              text-xs font-medium
              border px-3 py-1.5 rounded-xl
              transition-all duration-300 shadow-sm
              ${theme?.uiClass || "bg-slate-900/40 border-white/5 text-slate-400"}
              ${theme?.uiBtnHover || "hover:opacity-80"}
            `}
          >
            <span className="inline-block animate-pulse text-violet-400 group-hover:scale-110 transition-transform">
              ✨
            </span>
            Reflect on today's achievements?
            <span
              className={`
                text-[10px] px-1.5 py-0.5 rounded-md transition-colors
                ${theme?.isDark ? "bg-white/5" : "bg-black/5"}
                ${theme?.mutedClass || "text-slate-500"}
              `}
            >
              {visibleItems.length} available
            </span>
          </button>
        </div>
      ) : (
        /* ── Expanded panel ── */
        <div
          className={`
            rounded-2xl border p-4
            space-y-3 relative overflow-hidden
            transition-colors duration-500
            ${theme?.uiClass || "border-white/5 bg-slate-900/40"}
          `}
        >
          {/* Panel header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🧠</span>
              <h4
                className={`text-xs font-semibold tracking-wider uppercase ${
                  theme?.isDark ? "text-violet-400" : "text-violet-600"
                }`}
              >
                Focal Points to Anchor Your Reflection
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`
                text-[10px] uppercase font-bold
                px-2 py-1 rounded-md transition-all
                ${theme?.mutedClass || "text-slate-500"}
                ${theme?.uiBtnHover || "hover:opacity-80"}
              `}
            >
              Hide ✕
            </button>
          </div>

          {/* Todo item chips */}
          <div className="flex flex-wrap gap-1.5 pt-1 max-h-32 overflow-y-auto">
            {visibleItems.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => {
                  onInsertMention?.(item.title);
                  setUsedTodoIds((prev) => new Set([...prev, item._id]));
                }}
                className={`
                  text-xs px-3 py-1.5 rounded-xl border
                  transition-all duration-300 transform active:scale-95
                  text-left max-w-xs truncate
                  ${theme?.borderClass || "border-white/10"}
                  ${theme?.uiBtnHover || "hover:opacity-80"}
                `}
              >
                ✦ {item.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
