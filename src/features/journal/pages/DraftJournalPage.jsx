import { getDraftIndex } from "../draftStorage/storage";
import { getThemeConfig } from "../utils/journalThemes";
import { useNavigate } from "react-router-dom";
export default function DraftJournalPage() {
  const navigate = useNavigate();
  const drafts = getDraftIndex();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Draft Journals</h1>

      {drafts.length === 0 ? (
        <p>No unfinished journals.</p>
      ) : (
        drafts.map((draft) => {
          const theme = getThemeConfig(draft.themePreset);

          return (
            <div
              onClick={() => navigate(`/app/journals/new?draft=${draft.id}`)}
              key={draft.id}
              className={`rounded-2xl border p-5 mb-4 transition hover:scale-[1.01] cursor-pointer ${theme.borderClass} ${theme.bgClass}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-xl font-bold ${theme.textClass}`}>
                    {draft.title || "Untitled Journal"}
                  </h2>

                  <p className={`text-sm mt-1 ${theme.mutedClass}`}>
                    {draft.preview || "No preview available"}
                  </p>
                </div>

                <div className="text-2xl">
                  {{
                    happy: "😊",
                    sad: "😢",
                    neutral: "😐",
                    anxious: "😰",
                    excited: "✨",
                    angry: "😡",
                    grateful: "🙏",
                    tired: "🥱",
                    reflective: "🤔",
                  }[draft.mood] || "📖"}
                </div>
              </div>

              <div className={`mt-4 text-xs ${theme.mutedClass}`}>
                Last edited • {new Date(draft.updatedAt).toLocaleString()}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
