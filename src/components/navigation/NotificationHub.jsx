import { useState, useRef, useEffect } from "react";
import { useTodos } from "../../features/todos/hooks/useTodos";
import { useUpdateTodo } from "../../features/todos/hooks/useUpdateTodo";
import { useDeleteTodo } from "../../features/todos/hooks/useDeleteTodo";

import toast from "react-hot-toast";

export default function NotificationHub() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: rawTodos, isLoading } = useTodos();

  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  // Close dropdown if user clicks outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return null;

  // Compute "Yesterday or Older" unfinished tasks on the fly
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Flatten active horizons to find items left behind from yesterday
  const allActiveTodos = [
    ...(rawTodos?.today || []),
    ...(rawTodos?.week || []),
    ...(rawTodos?.later || []),
  ];

  const staleTasks = allActiveTodos.filter((todo) => {
    const taskDate = new Date(todo.createdAt || todo.updatedAt);
    return taskDate < startOfToday && todo.horizonType === "today";
  });

  const hasNotifications = staleTasks.length > 0;

  // Evening check configurations
  const isEvening = new Date().getHours() >= 20; // After 8 PM
  const hasActiveTodayTasks = (rawTodos?.today?.length || 0) > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 flex items-center justify-center outline-none"
      >
        <span className="text-base select-none">🔔</span>
        {hasNotifications && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-violet-400 animate-ping" />
        )}
      </button>

      {/* Glassmorphic Dropdown Drawer Wrapper */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/80 z-50 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Focus Center Alerts
            </h3>
            <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full font-medium">
              {staleTasks.length} pending items
            </span>
          </div>

          {/* Evening System Notice Alert Box */}
          {isEvening && hasActiveTodayTasks && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-fuchsia-500/10 to-violet-500/10 border border-violet-500/20 animate-pulse">
              <p className="text-[11px] text-fuchsia-300 font-medium">
                🌙 Evening Focus Alignment
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                The day is ending soon. Fulfill your outstanding actions or lock
                down reflections inside your Sanctuary Journal before the reset.
              </p>
            </div>
          )}

          {staleTasks.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              ✨ Ground clean. All system coordinates aligned.
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong>Attention:</strong> You have active intentions left
                unfinished from previous days. How should we process them?
              </p>

              {staleTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-3 rounded-xl border border-white/5 bg-white/[0.02] space-y-2.5 transition-all hover:border-white/10"
                >
                  <p className="text-xs font-medium text-slate-200 truncate">
                    ⚠️ {task.title}
                  </p>

                  {/* Interactive Option Matrix */}
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/[0.03]">
                    <button
                      type="button"
                      onClick={() => {
                        updateMutation.mutate({
                          todoId: task._id,
                          data: { createdAt: new Date() },
                        });
                        toast.success("Rolled over to today ☀️");
                      }}
                      className="text-[10px] py-1 rounded bg-white/5 text-slate-300 hover:bg-violet-500/20 hover:text-violet-200 transition-all font-medium text-center"
                    >
                      ☀️ Rollover
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateMutation.mutate({
                          todoId: task._id,
                          data: { horizonType: "week" },
                        });
                        toast.success("Parked to Weekly scope");
                      }}
                      className="text-[10px] py-1 rounded bg-white/5 text-slate-300 hover:bg-amber-500/10 hover:text-amber-300 transition-all font-medium text-center"
                    >
                      🗓️ Park
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteMutation.mutate(task._id);
                        toast.success("Intention discarded peacefully");
                      }}
                      className="text-[10px] py-1 rounded bg-white/5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all font-medium text-center"
                    >
                      ✕ Discard
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
