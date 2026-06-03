import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Button, Input, PageHeader } from "@/components/ui";

import { todoSchema } from "../validation/todoSchema";
import useCreateTodo from "../hooks/useCreateTodo";

function CreateTodoPage() {
  const navigate = useNavigate();

  const createTodoMutation = useCreateTodo();

  const {
    register,
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

      toast.success("Todo created successfully ✨");

      navigate("/app/todos");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create todo");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Create Todo"
        description="Turn intentions into small achievable steps."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <Input placeholder="What needs to be done?" {...register("title")} />

        {errors.title && (
          <p className="text-sm text-red-400">{errors.title.message}</p>
        )}

        <textarea
          rows={5}
          placeholder="Optional description..."
          {...register("description")}
          className="
            w-full
            rounded-2xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
            text-slate-200
            outline-none
          "
        />

        <div className="grid gap-4 md:grid-cols-2">
          <select
            {...register("priority")}
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-4
              py-3
              text-slate-200
            "
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            {...register("horizonType")}
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-4
              py-3
              text-slate-200
            "
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="long-term">Long Term</option>
          </select>
        </div>

        <Button type="submit" isLoading={createTodoMutation.isPending}>
          Create Todo
        </Button>
      </form>
    </div>
  );
}

export default CreateTodoPage;
