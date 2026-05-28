export const getDraftKey = (journalId) => `journal-draft-${journalId}`;

export const saveJournalDraft = ({ journalId, title, content }) => {
  localStorage.setItem(
    getDraftKey(journalId),
    JSON.stringify({
      title,
      content,
      updatedAt: Date.now(),
    })
  );
};

export const loadJournalDraft = (journalId) => {
  const draft = localStorage.getItem(getDraftKey(journalId));

  if (!draft) return null;

  try {
    return JSON.parse(draft);
  } catch {
    return null;
  }
};

export const clearJournalDraft = (journalId) => {
  localStorage.removeItem(getDraftKey(journalId));
};
