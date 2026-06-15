import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion"; // Elite motion layers
import API from "@/services/api";

import { PageHeader, Input, Button } from "@/components/ui";
import { todoSchema } from "../validation/todoSchema";
import { useTodos } from "../hooks/useTodos";
import { useCreateTodo } from "../hooks/useCreateTodo";
import { useUpdateTodo } from "../hooks/useUpdateTodo";
import { useDeleteTodo } from "../hooks/useDeleteTodo";

// Orchestration graphs for sequential list cascades
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

  // Pure data derivation driven straight by the server payload
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
      <div className="py-32 text-center text-slate-500 font-light tracking-widest text-xs animate-pulse">
        CALIBRATING SPATIAL HORIZONS...
      </div>
    );

  if (isError)
    return (
      <div className="py-20 text-center text-rose-400/80 font-medium text-sm">
        Failed to sync with workspace matrix.
      </div>
    );

  return (
    <div className="space-y-10 max-w-3xl mx-auto px-4 pb-24">
      {/* Header Architecture */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/[0.04] pb-6">
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
            className="text-[11px] font-medium tracking-wide uppercase px-4 py-2 rounded-xl border border-white/5 bg-white/[0.01] text-slate-400 hover:text-slate-200 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all duration-300"
          >
            {sweepMutation.isPending ? "Sweeping..." : "🧹 Sweep Achieved"}
          </button>
        )}
      </div>

      {/* Spatial Switchboard Layout with Sliding Kinetic Pill */}
      <div className="grid grid-cols-3 p-1.5 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-md relative">
        {["today", "week", "later"].map((tab) => {
          const isActive = activeHorizon === tab;
          const count = separatedTodos?.[tab]?.length || 0;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveHorizon(tab)}
              className={`relative py-3 rounded-xl text-xs font-semibold tracking-wide uppercase transition-colors duration-300 outline-none ${
                isActive ? "text-white" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeHorizonPill"
                  className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 rounded-xl shadow-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                {tab === "today" && "☀️ "}
                {tab === "week" && "🗓️ "}
                {tab === "later" && "⏳ "}
                {tab}
                <span
                  className={`text-[10px] font-normal px-1.5 py-0.5 rounded-full transition-colors ${isActive ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-slate-600"}`}
                >
                  {count}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* The Hero Arc: North Star Frame with Micro-fluid Entrances */}
      <AnimatePresence mode="wait">
        {northStarTask && (
          <motion.div
            key={northStarTask._id}
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative group rounded-3xl p-px bg-gradient-to-b from-violet-500/30 via-white/5 to-white/5 shadow-2xl shadow-violet-500/[0.02]"
          >
            <div className="rounded-[23px] bg-gradient-to-b from-slate-950 to-slate-900/90 p-6 sm:p-8 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest uppercase text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">
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
                  className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  ✕ Unpin Focus
                </button>
              </div>

              <div className="flex items-start justify-between gap-4 pt-2">
                <h2 className="text-lg sm:text-xl font-medium text-slate-100 tracking-tight leading-relaxed max-w-xl">
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
                  className="h-8 w-8 rounded-xl border border-violet-500/30 bg-violet-500/5 hover:bg-emerald-500/20 hover:border-emerald-500/40 text-transparent hover:text-emerald-400 flex items-center justify-center transition-all duration-300 shadow-lg text-sm shrink-0"
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
        <div className="flex gap-2 items-center rounded-2xl border border-white/5 bg-slate-900/20 p-2 transition-all duration-300 focus-within:border-white/15 focus-within:bg-slate-900/50">
          <Input
            placeholder={`Commit to an intention for ${activeHorizon}...`}
            {...register("title")}
            autoComplete="off"
            className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm text-slate-200 placeholder-slate-600 w-full px-3"
          />
          <button className="px-4 py-2 text-sm font-medium text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 rounded-lg hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 ease-in-out shadow-sm hover:shadow-indigo-500/20">
            Commit
          </button>
        </div>
        {errors.title && (
          <p className="text-xs text-rose-400/80 px-2 animate-fade-in">
            {errors.title.message}
          </p>
        )}
      </form>

      {/* Intentions List Shelf with Layout Orchestration Cascades */}
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
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-3">
                  Secondary Intentions
                </h3>
              )}

              <div className="space-y-2.5">
                {standardTasks.map((todo) => (
                  <motion.div
                    key={todo._id}
                    variants={listItemVariants}
                    layout="position" // Prevents layout snaps when sibling items exit the DOM
                    className="group flex items-center justify-between rounded-2xl border border-white/[0.03] bg-gradient-to-b from-white/[0.02] to-transparent p-4 transition-all duration-300 hover:border-white/10 hover:from-white/[0.04]"
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
                        className="h-5 w-5 shrink-0 rounded-lg border border-slate-700 hover:border-emerald-400/60 transition-all flex items-center justify-center text-transparent hover:text-emerald-400 text-xs"
                      >
                        ✓
                      </button>
                      <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors truncate">
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
                          className="text-[10px] tracking-wide px-2 py-1 rounded-lg bg-white/5 border border-white/5 hover:border-violet-500/30 text-slate-400 hover:text-violet-300 transition-all"
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
                                // Strip pin flag if shifting away from current focus horizon
                                data: { horizonType: h, isPinned: false },
                              });
                            }}
                            className="text-[10px] px-2 py-1 rounded-lg bg-white/5 text-slate-400 hover:text-slate-200 transition-all capitalize"
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
                        className="text-xs p-1 px-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-all"
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

        {/* Empty Horizon State Animated Container */}
        {activeCount === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[32px] border border-dashed border-white/5 py-16 text-center bg-white/[0.002]"
          >
            <p className="text-xs text-slate-500 font-light tracking-wide max-w-xs mx-auto leading-relaxed">
              This space is completely clear. No mental weights or passive
              backlogs anchored here.
            </p>
          </motion.div>
        )}

        {/* Achieved Items Section */}
        {completedCount > 0 && (
          <div className="pt-4 space-y-2.5">
            <h4 className="text-[10px] font-bold tracking-wider uppercase text-slate-600 px-1">
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
                      animate={{ opacity: 0.3, y: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      whileHover={{ opacity: 0.6 }}
                      layout="position"
                      className="flex items-center justify-between rounded-xl border border-white/[0.01] bg-white/[0.005] p-3 transition-all duration-300"
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
                          className="h-5 w-5 shrink-0 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs"
                        >
                          ✓
                        </button>
                        <span className="text-xs font-medium line-through text-slate-400 truncate">
                          {todo.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(todo._id)}
                        className="text-xs text-slate-600 hover:text-rose-400 p-1"
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
