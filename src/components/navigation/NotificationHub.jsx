// src/components/navigation/NotificationHub.jsx
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
      {/* 🔔 Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: "var(--overlay-light, rgba(255, 255, 255, 0.03))",
          borderColor: "var(--border-subtle)",
          color: "var(--text-primary)",
        }}
        className="relative p-2 rounded-xl border transition-all duration-300 flex items-center justify-center outline-none cursor-pointer hover:opacity-80"
      >
        <span className="text-base select-none">🔔</span>
        {hasNotifications && (
          <span
            style={{ backgroundColor: "var(--accent-primary)" }}
            className="absolute top-1 right-1 h-2 w-2 rounded-full animate-ping"
          />
        )}
      </button>

      {/* 🌟 Glassmorphic Dropdown Drawer Wrapper */}
      {isOpen && (
        <div
          style={{
            backgroundColor: "var(--surface-elevated)",
            borderColor: "var(--border-subtle)",
            boxShadow:
              "var(--shadow-popup, 0 10px 25px -5px rgba(0, 0, 0, 0.15))",
            backdropFilter: "blur(var(--blur-modal, 24px))",
            WebkitBackdropFilter: "blur(var(--blur-modal, 24px))",
          }}
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border p-4 z-50 space-y-3"
        >
          {/* Header */}
          <div
            style={{ borderColor: "var(--border-subtle)" }}
            className="flex items-center justify-between border-b pb-2"
          >
            <h3
              style={{ color: "var(--text-muted)" }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              Focus Center Alerts
            </h3>
            <span
              style={{
                color: "var(--accent-primary)",
                backgroundColor:
                  "var(--overlay-light, rgba(255, 255, 255, 0.05))",
              }}
              className="text-[10px] px-2 py-0.5 rounded-full font-medium border"
            >
              {staleTasks.length} pending items
            </span>
          </div>

          {/* Evening System Notice Alert Box */}
          {isEvening && hasActiveTodayTasks && (
            <div
              style={{
                background:
                  "linear-gradient(to right, var(--overlay-light), transparent)",
                borderColor: "var(--border-default)",
              }}
              className="p-3 rounded-xl border animate-pulse"
            >
              <p
                style={{ color: "var(--accent-primary)" }}
                className="text-[11px] font-medium"
              >
                🌙 Evening Focus Alignment
              </p>
              <p
                style={{ color: "var(--text-secondary)" }}
                className="text-[10px] mt-0.5 leading-normal"
              >
                The day is ending soon. Fulfill your outstanding actions or lock
                down reflections inside your Sanctuary Journal before the reset.
              </p>
            </div>
          )}

          {staleTasks.length === 0 ? (
            <div
              style={{ color: "var(--text-muted)" }}
              className="py-6 text-center text-xs"
            >
              ✨ Ground clean. All system coordinates aligned.
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              <p
                style={{ color: "var(--text-secondary)" }}
                className="text-[11px] leading-relaxed"
              >
                <strong>Attention:</strong> You have active intentions left
                unfinished from previous days. How should we process them?
              </p>

              {staleTasks.map((task) => (
                <div
                  key={task._id}
                  style={{
                    backgroundColor:
                      "var(--overlay-light, rgba(0, 0, 0, 0.02))",
                    borderColor: "var(--border-subtle)",
                  }}
                  className="p-3 rounded-xl border space-y-2.5 transition-all"
                >
                  <p
                    style={{ color: "var(--text-primary)" }}
                    className="text-xs font-medium truncate"
                  >
                    ⚠️ {task.title}
                  </p>

                  {/* Interactive Option Matrix */}
                  <div
                    style={{ borderColor: "var(--border-subtle)" }}
                    className="grid grid-cols-3 gap-1 pt-1 border-t"
                  >
                    {/* Rollover Button */}
                    <button
                      type="button"
                      onClick={() => {
                        updateMutation.mutate({
                          todoId: task._id,
                          data: { createdAt: new Date() },
                        });
                        toast.success("Rolled over to today ☀️");
                      }}
                      style={{
                        backgroundColor:
                          "var(--overlay-light, rgba(0, 0, 0, 0.04))",
                        color: "var(--text-secondary)",
                      }}
                      className="text-[10px] py-1 rounded transition-all font-medium text-center cursor-pointer hover:bg-[var(--accent-primary)] hover:text-[var(--text-inverse)]"
                    >
                      ☀️ Rollover
                    </button>

                    {/* Park Button */}
                    <button
                      type="button"
                      onClick={() => {
                        updateMutation.mutate({
                          todoId: task._id,
                          data: { horizonType: "week" },
                        });
                        toast.success("Parked to Weekly scope");
                      }}
                      style={{
                        backgroundColor:
                          "var(--overlay-light, rgba(0, 0, 0, 0.04))",
                        color: "var(--text-secondary)",
                      }}
                      className="text-[10px] py-1 rounded transition-all font-medium text-center cursor-pointer hover:bg-[var(--warning,orange)] hover:text-white"
                    >
                      🗓️ Park
                    </button>

                    {/* Discard Button */}
                    <button
                      type="button"
                      onClick={() => {
                        deleteMutation.mutate(task._id);
                        toast.success("Intention discarded peacefully");
                      }}
                      style={{
                        backgroundColor:
                          "var(--overlay-light, rgba(0, 0, 0, 0.04))",
                        color: "var(--text-muted)",
                      }}
                      className="text-[10px] py-1 rounded transition-all font-medium text-center cursor-pointer hover:bg-[var(--danger,red)] hover:text-white"
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
