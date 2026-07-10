import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import API from "@/services/api";

import { PageHeader, Input, Button } from "@/components/ui";
import { todoSchema } from "../validation/todoSchema";
import { useTodos } from "../hooks/useTodos";
import { useCreateTodo } from "../hooks/useCreateTodo";
import { useUpdateTodo } from "../hooks/useUpdateTodo";
import { useDeleteTodo } from "../hooks/useDeleteTodo";

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(2px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
  exit: {
    opacity: 0,
    x: -12,
    filter: "blur(2px)",
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

export default function TodosPage() {
  const queryClient = useQueryClient();
  const { data: separatedTodos, isLoading, isError } = useTodos();
  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  const [activeHorizon, setActiveHorizon] = useState("today");

  const sweepMutation = useMutation({
    mutationFn: async () => {
      const response = await API.delete("/todos/completed");
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Workspace swept clean");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: () => toast.error("Sweep failed"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: { title: "", horizonType: "today" },
  });

  const activeCount = separatedTodos?.[activeHorizon]?.length || 0;
  const completedCount =
    separatedTodos?.completedToday?.filter(
      (t) => t.horizonType === activeHorizon
    ).length || 0;

  const activeTasks = separatedTodos?.[activeHorizon] || [];
  const isTodayHorizon = activeHorizon === "today";

  const northStarTask = isTodayHorizon
    ? activeTasks.find((t) => t.isPinned === true) || null
    : null;

  const standardTasks = northStarTask
    ? activeTasks.filter((t) => t._id !== northStarTask._id)
    : activeTasks;

  const onSubmit = async (formData) => {
    try {
      await createMutation.mutateAsync({
        title: formData.title,
        horizonType: activeHorizon,
      });
      toast.success("Intention captured ✨");
      reset({ title: "", horizonType: activeHorizon });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save intention");
    }
  };

  if (isLoading)
    return (
      <div className="py-32 text-center text-[var(--text-muted)] font-light tracking-widest text-xs animate-pulse">
        CALIBRATING SPATIAL HORIZONS...
      </div>
    );

  if (isError)
    return (
      <div className="py-20 text-center text-[var(--danger)] font-medium text-sm">
        Failed to sync with workspace matrix.
      </div>
    );

  return (
    <div className="space-y-10 max-w-3xl mx-auto px-4 pb-24 text-[var(--text-primary)]">
      {/* Header Architecture */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--border-default)] pb-6">
        <PageHeader
          title="Intentions"
          description="A spatial workspace built to separate immediate noise from deep commitments."
        />
        {separatedTodos?.completedToday?.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Clear achieved tasks?")) sweepMutation.mutate();
            }}
            disabled={sweepMutation.isPending}
            className="text-[11px] font-medium tracking-wide uppercase px-4 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--danger)] hover:border-[var(--danger)] transition-all duration-300"
          >
            {sweepMutation.isPending ? "Sweeping..." : "🧹 Sweep Achieved"}
          </button>
        )}
      </div>

      {/* Spatial Switchboard Layout */}
      <div className="grid grid-cols-3 p-1.5 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border-subtle)] backdrop-blur-md relative">
        {["today", "week", "later"].map((tab) => {
          const isActive = activeHorizon === tab;
          const count = separatedTodos?.[tab]?.length || 0;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveHorizon(tab)}
              className={`relative py-3 rounded-xl text-xs font-semibold tracking-wide uppercase transition-colors duration-300 outline-none ${
                isActive
                  ? "text-[var(--accent-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeHorizonPill"
                  className="absolute inset-0 bg-[var(--surface-elevated)] border border-[var(--border-default)] rounded-xl shadow-[var(--shadow-sm)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                {tab === "today" && "☀️ "}
                {tab === "week" && "🗓️ "}
                {tab === "later" && "⏳ "}
                {tab}
                <span
                  className={`text-[10px] font-normal px-1.5 py-0.5 rounded-full transition-colors ${isActive ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]" : "bg-[var(--surface-primary)] text-[var(--text-muted)]"}`}
                >
                  {count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* The Hero Arc: North Star Frame */}
      <AnimatePresence mode="wait">
        {northStarTask && (
          <motion.div
            key={northStarTask._id}
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative group rounded-[24px] p-px bg-gradient-to-b from-[var(--accent-primary)] to-[var(--border-subtle)] shadow-[var(--shadow-glow)]"
          >
            <div className="rounded-[23px] bg-[var(--surface-elevated)] p-6 sm:p-8 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-2.5 py-1 rounded-full border border-[var(--accent-primary)]/20">
                  ⭐ Primary Focus Intention
                </span>
                <button
                  type="button"
                  onClick={() => {
                    updateMutation.mutate({
                      todoId: northStarTask._id,
                      data: { isPinned: false },
                    });
                  }}
                  className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  ✕ Unpin Focus
                </button>
              </div>

              <div className="flex items-start justify-between gap-4 pt-2">
                <h2 className="text-lg sm:text-xl font-medium text-[var(--text-primary)] tracking-tight leading-relaxed max-w-xl">
                  {northStarTask.title}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    updateMutation.mutate({
                      todoId: northStarTask._id,
                      data: { status: "completed", isPinned: false },
                    });
                  }}
                  className="h-8 w-8 rounded-xl border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 hover:bg-[var(--success)]/20 hover:border-[var(--success)]/40 text-transparent hover:text-[var(--success)] flex items-center justify-center transition-all duration-300 shadow-sm text-sm shrink-0"
                >
                  ✓
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Field Form Design */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex gap-2 items-center rounded-2xl border border-[var(--border-default)] bg-[var(--surface-primary)] p-2 transition-all duration-300 focus-within:border-[var(--accent-primary)] focus-within:shadow-[var(--shadow-glow)]">
          <Input
            placeholder={`Commit to an intention for ${activeHorizon}...`}
            {...register("title")}
            autoComplete="off"
            className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] w-full px-3"
          />
          <button className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent-primary)] rounded-xl hover:bg-[var(--accent-hover)] transition-all duration-300 ease-in-out shadow-sm">
            Commit
          </button>
        </div>
        {errors.title && (
          <p className="text-xs text-[var(--danger)] px-2 animate-fade-in">
            {errors.title.message}
          </p>
        )}
      </form>

      {/* Intentions List Shelf */}
      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {standardTasks.length > 0 && (
            <motion.div
              key={`list-${activeHorizon}`}
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {northStarTask && (
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-1 mb-3">
                  Secondary Intentions
                </h3>
              )}

              <div className="space-y-2.5">
                {standardTasks.map((todo) => (
                  <motion.div
                    key={todo._id}
                    variants={listItemVariants}
                    layout="position"
                    className="group flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-4 transition-all duration-300 hover:border-[var(--border-default)] hover:shadow-[var(--shadow-sm)]"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateMutation.mutate({
                            todoId: todo._id,
                            data: { status: "completed" },
                          })
                        }
                        className="h-5 w-5 shrink-0 rounded-lg border border-[var(--border-strong)] hover:border-[var(--success)] transition-all flex items-center justify-center text-transparent hover:text-[var(--success)] hover:bg-[var(--success)]/10 text-xs"
                      >
                        ✓
                      </button>
                      <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors truncate">
                        {todo.title}
                      </span>
                    </div>

                    {/* Operational Hover Controls Row */}
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4 shrink-0">
                      {isTodayHorizon && (
                        <button
                          type="button"
                          onClick={() => {
                            updateMutation.mutate({
                              todoId: todo._id,
                              data: { isPinned: true },
                            });
                            toast.success("Primary focus set 🎯");
                          }}
                          className="text-[10px] tracking-wide px-2 py-1 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all"
                        >
                          ⭐ Pin Focus
                        </button>
                      )}

                      {["today", "week", "later"]
                        .filter((h) => h !== activeHorizon)
                        .map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => {
                              updateMutation.mutate({
                                todoId: todo._id,
                                data: { horizonType: h, isPinned: false },
                              });
                            }}
                            className="text-[10px] px-2 py-1 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-all capitalize"
                          >
                            → {h}
                          </button>
                        ))}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Erase intention?")) {
                            deleteMutation.mutate(todo._id);
                          }
                        }}
                        className="text-xs p-1 px-2 rounded-lg hover:bg-[var(--danger)]/10 text-[var(--text-muted)] hover:text-[var(--danger)] transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty Horizon State */}
        {activeCount === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[32px] border border-dashed border-[var(--border-strong)] py-16 text-center bg-[var(--surface-primary)]/30"
          >
            <p className="text-xs text-[var(--text-muted)] font-light tracking-wide max-w-xs mx-auto leading-relaxed">
              This space is completely clear. No mental weights or passive
              backlogs anchored here.
            </p>
          </motion.div>
        )}

        {/* Achieved Items Section */}
        {completedCount > 0 && (
          <div className="pt-4 space-y-2.5">
            <h4 className="text-[10px] font-bold tracking-wider uppercase text-[var(--text-muted)] px-1">
              Achieved in this Scope
            </h4>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {separatedTodos.completedToday
                  .filter((t) => t.horizonType === activeHorizon)
                  .map((todo) => (
                    <motion.div
                      key={todo._id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 0.4, y: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      whileHover={{ opacity: 0.8 }}
                      layout="position"
                      className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-secondary)]/50 p-3 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() =>
                            updateMutation.mutate({
                              todoId: todo._id,
                              data: { status: "pending" },
                            })
                          }
                          className="h-5 w-5 shrink-0 rounded-lg border border-[var(--success)]/50 bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center text-xs"
                        >
                          ✓
                        </button>
                        <span className="text-xs font-medium line-through text-[var(--text-muted)] truncate">
                          {todo.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(todo._id)}
                        className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)] p-1"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
