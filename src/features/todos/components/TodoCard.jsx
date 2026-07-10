import { Link } from "react-router-dom";

function TodoCard({ todo }) {
  return (
    <Link to={`/app/todos/${todo._id}`}>
      <article
        className="
          rounded-[28px]
          border border-[var(--border-default)]
          bg-[var(--surface-primary)]
          p-6
          transition-all
          duration-[var(--animation-default,300ms)]
          hover:-translate-y-1
          hover:border-[var(--accent-primary)]
          hover:shadow-[var(--shadow-sm)]
        "
      >
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">
          {todo.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-[var(--text-secondary)]">
          {todo.description}
        </p>
      </article>
    </Link>
  );
}

export default TodoCard;
