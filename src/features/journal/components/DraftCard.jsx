import { useNavigate } from "react-router-dom";
import Surface from "@/components/ui/Surface";
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlinePencil,
} from "react-icons/hi2";

const MOODS = {
  happy: "😊",
  sad: "😢",
  neutral: "😐",
  anxious: "😰",
  excited: "✨",
  angry: "😡",
  grateful: "🙏",
  tired: "🥱",
  reflective: "🤔",
};

export default function DraftCard({ draft, onDelete, onRename }) {
  const navigate = useNavigate();

  return (
    <Surface
      variant="elevated"
      className="p-5 transition-all duration-[var(--animation-default,220ms)] hover:-translate-y-0.5"
    >
      <div className="flex justify-between gap-4">
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => navigate(`/app/journals/new?draft=${draft.id}`)}
        >
          <h2 className="text-xl font-semibold text-[var(--text-primary)] truncate">
            {draft.title || "Untitled Journal"}
          </h2>

          <p className="text-[var(--text-secondary)] mt-2 line-clamp-2">
            {draft.preview || "No preview yet"}
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <HiOutlinePencilSquare />
            Last edited {new Date(draft.updatedAt).toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <div className="text-3xl">{MOODS[draft.mood] || "📖"}</div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRename}
              className="rounded-lg border border-border bg-surface p-2 text-muted hover:text-accent hover:border-accent transition"
              title="Rename Draft"
            >
              <HiOutlinePencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg border border-border bg-surface p-2 text-muted hover:text-red-500 hover:border-red-500 transition"
              title="Delete Draft"
            >
              <HiOutlineTrash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Surface>
  );
}
