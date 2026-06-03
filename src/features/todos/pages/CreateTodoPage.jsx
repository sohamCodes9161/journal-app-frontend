import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Button, Input, PageHeader } from "@/components/ui";

import useCreateTodo from "../hooks/useCreateTodo";
import { todoSchema } from "../validation/todoSchema";

function CreateTodoPage() {
  const navigate = useNavigate();

  const createTodoMutation = useCreateTodo();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(todoSchema),

    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      horizonType: "today",
    },
  });

  async function onSubmit(data) {
    try {
      await createTodoMutation.mutateAsync(data);

      toast.success("Task saved ✨");

      navigate("/app/todos");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create task");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="What's on your mind?"
        description="Capture a task before it slips away."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          mt-8
          rounded-[32px]
          border
          border-white/10
          bg-gradient-to-b
          from-white/[0.05]
          to-white/[0.02]
          p-8
          backdrop-blur-xl
        "
      >
        <div className="space-y-8">
          {/* TITLE */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Task</label>

            <Input
              placeholder="Finish backend pagination..."
              {...register("title")}
            />

            {errors.title && (
              <p className="text-sm text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* NOTES */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Notes</label>

            <textarea
              rows={3}
              placeholder="Optional notes..."
              {...register("description")}
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-4
                py-3
                text-slate-200
                outline-none
                transition-all
                focus:border-violet-500/40
              "
            />
          </div>

          {/* PRIORITY */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">
              Priority
            </label>

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {["low", "medium", "high"].map((priority) => {
                    const active = field.value === priority;

                    return (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => field.onChange(priority)}
                        className={`
                            rounded-full
                            border
                            px-4
                            py-2
                            text-sm
                            capitalize
                            transition-all

                            ${
                              active
                                ? `
                                  border-violet-500/40
                                  bg-violet-500/15
                                  text-violet-200
                                `
                                : `
                                  border-white/10
                                  bg-white/[0.03]
                                  text-slate-400
                                  hover:bg-white/[0.05]
                                `
                            }
                          `}
                      >
                        {priority}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          {/* HORIZON */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">
              Timeframe
            </label>

            <Controller
              name="horizonType"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      value: "today",
                      label: "Today",
                    },
                    {
                      value: "week",
                      label: "This Week",
                    },
                    {
                      value: "long-term",
                      label: "Long Term",
                    },
                  ].map((option) => {
                    const active = field.value === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={`
                          rounded-full
                          border
                          px-4
                          py-2
                          text-sm
                          transition-all

                          ${
                            active
                              ? `
                                border-violet-500/40
                                bg-violet-500/15
                                text-violet-200
                              `
                              : `
                                border-white/10
                                bg-white/[0.03]
                                text-slate-400
                                hover:bg-white/[0.05]
                              `
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          {/* ACTION */}
          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              isLoading={createTodoMutation.isPending}
            >
              Save Task
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateTodoPage;
