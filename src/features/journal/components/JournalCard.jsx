function JournalCard({ journal }) {
  return (
    <article
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-5
        backdrop-blur-sm
        transition
        hover:bg-white/10
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{journal.title}</h3>

          <p className="mt-1 text-sm text-slate-400">{journal.mood}</p>
        </div>

        <span className="text-xs text-slate-500">
          {new Date(journal.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {journal.tags?.map((tag) => (
          <span
            key={tag}
            className="
              rounded-full
              bg-white/10
              px-3
              py-1
              text-xs
              text-slate-300
            "
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}

export default JournalCard;
