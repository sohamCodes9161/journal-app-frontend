import { useState } from "react";
import { getThemeConfig } from "../utils/journalThemes";
import { useNavigate } from "react-router-dom";
import DraftCard from "../components/DraftCard";

import {
  getDraftIndex,
  clearDraft,
  removeDraftFromIndex,
  renameDraftInIndex,
  saveDraft,
  loadDraft,
} from "../draftStorage/storage";

export default function DraftJournalPage() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState(getDraftIndex());

  const handleDelete = (draft) => {
    if (!window.confirm("Delete this draft?")) return;

    clearDraft(draft.id);
    removeDraftFromIndex(draft.id);

    setDrafts(getDraftIndex());
  };

  const handleRename = (draft) => {
    const newTitle = prompt("New title", draft.title);

    if (!newTitle?.trim()) return;

    renameDraftInIndex(draft.id, newTitle.trim());

    const fullDraft = loadDraft(draft.id);

    if (fullDraft) {
      saveDraft(draft.id, {
        ...fullDraft,
        title: newTitle.trim(),
      });
    }

    setDrafts(getDraftIndex());
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Draft Journals</h1>

      {drafts.length === 0 ? (
        <p>No unfinished journals.</p>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              onDelete={handleDelete}
              onRename={handleRename}
            />
          ))}
        </div>
      )}
    </div>
  );
}
