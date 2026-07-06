import { useNavigate } from "react-router-dom";
import { getThemeConfig } from "../utils/journalThemes";

const MOOD_EMOJIS = {
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

  const theme = getThemeConfig(draft.themePreset);

  return (
    <div
      className={`rounded-2xl border p-5 transition hover:shadow-lg ${theme.borderClass} ${theme.bgClass}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div
          className="flex-1 cursor-pointer"
          onClick={() => navigate(`/app/journals/new?draft=${draft.id}`)}
        >
          <h2 className={`text-xl font-bold ${theme.textClass}`}>
            {draft.title || "Untitled Journal"}
          </h2>

          <p className={`mt-2 text-sm ${theme.mutedClass}`}>
            {draft.preview || "No preview available"}
          </p>

          <p className={`mt-4 text-xs ${theme.mutedClass}`}>
            Last edited • {new Date(draft.updatedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span className="text-2xl">{MOOD_EMOJIS[draft.mood] || "📖"}</span>

          <div className="flex gap-2">
            <button
              onClick={() => onRename(draft)}
              className="text-xs px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300"
            >
              Rename
            </button>

            <button
              onClick={() => onDelete(draft)}
              className="text-xs px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
