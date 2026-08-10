import { Link } from "react-router-dom";

function TodoCard({ todo }) {
  return (
    <Link to={`/app/todos/${todo._id}`} className="block w-full min-w-0">
      <article
        className="
          w-full
          min-w-0
          overflow-hidden
          rounded-[20px] sm:rounded-[28px]
          border border-[var(--border-default)]
          bg-[var(--surface-primary)]
          p-4 sm:p-6
          transition-all
          duration-[var(--animation-default,300ms)]
          hover:-translate-y-1
          hover:border-[var(--accent-primary)]
          hover:shadow-[var(--shadow-sm)]
        "
      >
        <h3 className="text-base sm:text-xl font-semibold text-[var(--text-primary)] truncate">
          {todo.title}
        </h3>

        {todo.description && (
          <p className="mt-2 sm:mt-3 line-clamp-2 text-xs sm:text-sm text-[var(--text-secondary)] break-words">
            {todo.description}
          </p>
        )}
      </article>
    </Link>
  );
}

export default TodoCard;
