import { Link } from "react-router-dom";
import { extractTextFromContent } from "../utils/extractTextFromContent";

const MOOD_DICTIONARY = {
  happy: {
    emoji: "😊",
    styles: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  sad: {
    emoji: "😢",
    styles: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  neutral: {
    emoji: "😐",
    styles: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
  anxious: {
    emoji: "😰",
    styles: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  excited: {
    emoji: "✨",
    styles: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
  },
  angry: {
    emoji: "😡",
    styles: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  grateful: {
    emoji: "🙏",
    styles: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  tired: {
    emoji: "🥱",
    styles: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  reflective: {
    emoji: "🤔",
    styles: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
};

function JournalCard({ journal }) {
  const preview = extractTextFromContent(journal.content);
  const truncatedPreview =
    preview.length > 180 ? `${preview.slice(0, 180)}...` : preview;

  const currentMood = journal.mood?.toLowerCase() || "neutral";
  const moodConfig = MOOD_DICTIONARY[currentMood] || MOOD_DICTIONARY.neutral;

  return (
    <Link to={`/app/journals/${journal.id}`} className="block">
      <article
        className="
          group
          relative
          overflow-hidden
          rounded-[24px]
          border
          border-white/10
          bg-gradient-to-br
          from-white/[0.06]
          to-white/[0.02]
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
        <div className="relative z-10 flex flex-col gap-3">
          {/* Row 1: Title & Mood */}
          <div className="flex items-start justify-between gap-4">
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
              {journal.title || "Untitled Entry"}
            </h3>

            {/* Mood Badge */}
            <span
              className={`
                shrink-0
                flex 
                items-center 
                gap-1.5 
                px-2.5 
                py-1 
                rounded-xl 
                border 
                text-xs 
                font-bold 
                uppercase 
                tracking-wider 
                ${moodConfig.styles}
              `}
            >
              <span>{moodConfig.emoji}</span>
              <span>{journal.mood || "neutral"}</span>
            </span>
          </div>

          {/* Row 2: Date */}
          <div className="text-xs font-medium tracking-wide text-slate-500">
            {new Date(journal.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          {/* Row 3: Preview Content */}
          <p
            className="
              mt-2
              line-clamp-3
              text-sm
              leading-relaxed
              text-slate-400
            "
          >
            {truncatedPreview || "Empty entry thoughts..."}
          </p>

          {/* Optional Row 4: Tags (Only shows if they exist) */}
          {journal.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {journal.tags.map((tag) => (
                <span
                  key={tag}
                  className="
                    rounded-full
                    border
                    border-white/5
                    bg-white/[0.04]
                    px-2.5
                    py-0.5
                    text-xs
                    font-medium
                    text-slate-400
                  "
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Soft interactive glow effect on hover */}
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
      </article>
    </Link>
  );
}

export default JournalCard;
