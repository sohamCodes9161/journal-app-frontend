import { Link } from "react-router-dom";
import Surface from "@/components/ui/Surface";
import Typography from "@/components/ui/Typography";
import { extractTextFromContent } from "../utils/extractTextFromContent";

// 1. Softened Dictionary: Removed harsh borders, shifted to solid soft pastels
const MOOD_DICTIONARY = {
  happy: { emoji: "😊", styles: "bg-emerald-100 text-emerald-700" },
  sad: { emoji: "😢", styles: "bg-blue-100 text-blue-700" },
  neutral: { emoji: "😐", styles: "bg-slate-100 text-slate-600" },
  anxious: { emoji: "😰", styles: "bg-amber-100 text-amber-700" },
  excited: { emoji: "✨", styles: "bg-fuchsia-100 text-fuchsia-700" },
  angry: { emoji: "😡", styles: "bg-rose-100 text-rose-700" },
  grateful: { emoji: "🙏", styles: "bg-indigo-100 text-indigo-700" },
  tired: { emoji: "🥱", styles: "bg-purple-100 text-purple-700" },
  reflective: { emoji: "🤔", styles: "bg-cyan-100 text-cyan-700" },
};

function JournalCard({ journal }) {
  const preview = extractTextFromContent(journal.content);
  const truncatedPreview =
    preview.length > 180 ? `${preview.slice(0, 180)}...` : preview;

  const currentMood = journal.mood?.toLowerCase() || "neutral";
  const moodConfig = MOOD_DICTIONARY[currentMood] || MOOD_DICTIONARY.neutral;

  return (
    <Link to={`/app/journals/${journal.id}`} className="block group h-full">
      {/* 2. Glass & Animation: Added glass={true}, custom background opacity, and slow, glowing hover states */}
      <Surface
        elevation={1}
        glass={true}
        className="h-full p-6 sm:p-8 bg-[var(--surface-primary)]/70 transition-all duration-[var(--animation-slow,320ms)] ease-out hover:-translate-y-2 hover:shadow-[var(--shadow-glow)] hover:border-[var(--accent-primary)] group-hover:bg-[var(--surface-elevated)]/90"
      >
        <div className="relative z-10 flex flex-col gap-3 h-full">
          {/* Row 1: Title & Mood */}
          <div className="flex items-start justify-between gap-4">
            <Typography
              variant="h3"
              className="leading-snug font-medium text-[var(--text-primary)]"
            >
              {journal.title || "Untitled Entry"}
            </Typography>

            {/* Soft, pill-shaped mood badge */}
            <span
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide ${moodConfig.styles}`}
            >
              <span className="text-sm">{moodConfig.emoji}</span>
              <span className="capitalize">{journal.mood || "neutral"}</span>
            </span>
          </div>

          {/* Row 2: Date */}
          <Typography
            variant="caption"
            className="text-[var(--text-muted)] tracking-wide"
          >
            {new Date(journal.createdAt).toLocaleDateString("en-US", {
              month: "long", // Switched to 'long' for a more literary, journaling feel (e.g., "July 10, 2026")
              day: "numeric",
              year: "numeric",
            })}
          </Typography>

          {/* Row 3: Preview Content */}
          <Typography
            variant="bodySmall"
            className="mt-2 line-clamp-3 leading-relaxed text-[var(--text-secondary)] grow"
          >
            {truncatedPreview || "Empty entry thoughts..."}
          </Typography>

          {/* Optional Row 4: Tags */}
          {journal.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {journal.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--background-secondary)]/50 px-3 py-1 text-xs font-medium text-[var(--text-muted)] transition-colors group-hover:bg-[var(--background-secondary)] group-hover:text-[var(--accent-primary)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Surface>
    </Link>
  );
}

export default JournalCard;
