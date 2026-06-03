import { Link } from "react-router-dom";

import { Button, PageHeader } from "@/components/ui";

import useTodos from "../hooks/useTodos";

function TodosPage() {
  const { data, isLoading, isError } = useTodos();

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">Loading todos...</div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-red-400">
        Failed to load todos.
      </div>
    );
  }

  const todos = data?.todos || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Todos"
          description="Small steps build meaningful progress."
        />

        <Link to="/app/todos/new">
          <Button>Create Todo</Button>
        </Link>
      </div>

      {todos.length === 0 ? (
        <div className="py-24 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Nothing planned yet
          </h2>

          <p className="mt-3 text-slate-400">
            Add your first task and begin moving forward.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                p-6
              "
            >
              <h3 className="text-lg font-semibold text-white">{todo.title}</h3>

              <p className="mt-2 text-slate-400">{todo.description}</p>

              <div className="mt-4 flex gap-3 text-sm">
                <span>{todo.priority}</span>
                <span>{todo.status}</span>
                <span>{todo.horizonType}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TodosPage;
