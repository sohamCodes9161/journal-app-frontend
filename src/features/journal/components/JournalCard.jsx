import { Link } from "react-router-dom";

import { extractTextFromContent } from "../utils/extractTextFromContent";

function JournalCard({ journal }) {
  const preview = extractTextFromContent(journal.content);

  const truncatedPreview =
    preview.length > 180 ? `${preview.slice(0, 180)}...` : preview;

  return (
    <Link to={`/app/journals/${journal.id}`}>
      <article
        className="
          group
          relative
          overflow-hidden
          rounded-[28px]
          border
          border-white/10
          bg-gradient-to-br
          from-white/[0.07]
          to-white/[0.03]
          p-6
          backdrop-blur-xl
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-violet-400/30
          hover:bg-white/[0.08]
          hover:shadow-2xl
          hover:shadow-violet-500/10
        "
      >
        {/* soft glow */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-br
            from-violet-500/5
            via-transparent
            to-cyan-500/5
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

        <div className="relative z-10">
          {/* top section */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              {/* mood badge */}
              <div
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  px-3
                  py-1
                  text-xs
                  font-medium
                  tracking-wide
                  text-slate-300
                  backdrop-blur-sm
                "
              >
                {journal.mood}
              </div>

              {/* title */}
              <h3
                className="
                  text-xl
                  font-semibold
                  leading-snug
                  tracking-tight
                  text-white
                  transition-colors
                  duration-200
                  group-hover:text-violet-100
                "
              >
                {journal.title}
              </h3>
            </div>

            {/* date */}
            <span
              className="
                shrink-0
                text-xs
                font-medium
                tracking-wide
                text-slate-500
              "
            >
              {new Date(journal.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* preview */}
          <p
            className="
              mt-5
              line-clamp-4
              text-sm
              leading-7
              text-slate-400
            "
          >
            {truncatedPreview}
          </p>

          {/* tags */}
          {journal.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {journal.tags.map((tag) => (
                <span
                  key={tag}
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-3
                    py-1
                    text-xs
                    font-medium
                    tracking-wide
                    text-slate-300
                    transition-all
                    duration-200
                    hover:bg-white/[0.08]
                  "
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export default JournalCard;
