// src/features/journal/components/editor/JournalReflectionHelper.jsx
import { useState } from "react";
import { useTodos } from "@/features/todos/hooks/useTodos";

export default function JournalReflectionHelper({ onInsertMention }) {
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
        <div className="flex justify-start px-1">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-violet-300 bg-slate-900/40 border border-white/5 hover:border-violet-500/20 px-3 py-1.5 rounded-xl transition-all duration-300 shadow-sm"
          >
            <span className="inline-block animate-pulse text-violet-400 group-hover:scale-110 transition-transform">
              ✨
            </span>
            Reflect on today's achievements?
            <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded-md text-slate-500 group-hover:text-violet-200 transition-colors">
              {visibleItems.length} available
            </span>
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 backdrop-blur-md space-y-3 animate-fade-in relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🧠</span>
              <h4 className="text-xs font-semibold tracking-wider uppercase text-violet-400/90">
                Focal Points to Anchor Your Reflection
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[10px] uppercase font-bold text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md transition-all"
            >
              Hide Canvas Clutter ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1 max-h-32 overflow-y-auto">
            {visibleItems.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => {
                  onInsertMention?.(item.title);
                  setUsedTodoIds((prev) => new Set([...prev, item._id]));
                }}
                className="text-xs px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.02] text-slate-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-200 transition-all duration-300 transform active:scale-95 text-left max-w-xs truncate"
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
