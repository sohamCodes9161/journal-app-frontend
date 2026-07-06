import { saveDraft, loadDraft, clearDraft, getDraftRegistry } from "./storage";

export function getDraft(id) {
  return loadDraft(id);
}

export function deleteDraft(id) {
  clearDraft(id);
}

export function listDrafts() {
  return getDraftRegistry()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((entry) => ({
      ...entry,
      draft: loadDraft(entry.id),
    }));
}

export function updateDraft(id, draft) {
  saveDraft(id, draft);
}
