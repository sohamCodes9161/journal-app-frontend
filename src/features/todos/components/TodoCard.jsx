import { Link } from "react-router-dom";

function TodoCard({ todo }) {
  return (
    <Link to={`/app/todos/${todo._id}`}>
      <article
        className="
          rounded-[28px]
          border border-white/10
          bg-gradient-to-b
          from-white/[0.06]
          to-white/[0.03]
          p-6
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-violet-500/30
        "
      >
        <h3 className="text-xl font-semibold text-white">{todo.title}</h3>

        <p className="mt-3 line-clamp-2 text-slate-400">{todo.description}</p>
      </article>
    </Link>
  );
}

export default TodoCard;
