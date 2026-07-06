import {
  DRAFT_STORAGE_PREFIX,
  DRAFT_VERSION,
  DRAFT_REGISTRY_KEY,
} from "./constants";

export function getDraftKey(id) {
  return `${DRAFT_STORAGE_PREFIX}${id}`;
}

function getRegistry() {
  try {
    const raw = localStorage.getItem(DRAFT_REGISTRY_KEY);

    if (!raw) return [];

    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRegistry(registry) {
  localStorage.setItem(DRAFT_REGISTRY_KEY, JSON.stringify(registry));
}

function updateRegistry(id, metadata = {}) {
  const registry = getRegistry();

  const existingIndex = registry.findIndex((item) => item.id === id);

  const entry = {
    id,
    updatedAt: Date.now(),
    ...metadata,
  };

  if (existingIndex >= 0) {
    registry[existingIndex] = entry;
  } else {
    registry.push(entry);
  }

  saveRegistry(registry);
}

function removeFromRegistry(id) {
  const registry = getRegistry().filter((item) => item.id !== id);

  saveRegistry(registry);
}

export function getDraftRegistry() {
  return getRegistry();
}

export function saveDraft(id, data) {
  try {
    localStorage.setItem(
      getDraftKey(id),
      JSON.stringify({
        version: DRAFT_VERSION,
        updatedAt: Date.now(),
        ...data,
      })
    );
    updateRegistry(id, {
      title: data.title || "",
      type: data.type || "create",
    });
    return true;
  } catch (err) {
    console.error("Failed to save draft:", err);
    return false;
  }
}

const DRAFT_INDEX_KEY = "journal:drafts:index";
export function upsertDraftIndex({
  id,
  title,
  mood,
  themePreset,
  preview,
  updatedAt = Date.now(),
  type = "create",
}) {
  try {
    const existing = JSON.parse(localStorage.getItem(DRAFT_INDEX_KEY) || "[]");

    const filtered = existing.filter((draft) => draft.id !== id);

    filtered.unshift({
      id,
      title: title || "Untitled",
      mood,
      themePreset,
      preview,
      updatedAt,
      type,
    });

    localStorage.setItem(DRAFT_INDEX_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error(err);
  }
}

export function removeDraftFromIndex(id) {
  try {
    const existing = JSON.parse(localStorage.getItem(DRAFT_INDEX_KEY) || "[]");

    const filtered = existing.filter((draft) => draft.id !== id);

    localStorage.setItem(DRAFT_INDEX_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error(err);
  }
}

export function getDraftIndex() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_INDEX_KEY) || "[]");
  } catch {
    return [];
  }
}

export function loadDraft(id) {
  try {
    const raw = localStorage.getItem(getDraftKey(id));

    if (!raw) return null;

    const draft = JSON.parse(raw);

    if (draft.version !== DRAFT_VERSION) {
      localStorage.removeItem(getDraftKey(id));
      return null;
    }

    return draft;
  } catch (err) {
    console.error("Failed to load draft:", err);
    return null;
  }
}

export function clearDraft(id) {
  console.trace();

  try {
    localStorage.removeItem(getDraftKey(id));
    removeFromRegistry(id);
  } catch (err) {
    console.error(err);
  }
}

export function hasDraft(id) {
  return localStorage.getItem(getDraftKey(id)) !== null;
}

export function getAllDraftKeys() {
  return Object.keys(localStorage).filter((key) =>
    key.startsWith(DRAFT_STORAGE_PREFIX)
  );
}
export function clearAllDrafts() {
  getAllDraftKeys().forEach((key) => localStorage.removeItem(key));

  localStorage.removeItem(DRAFT_REGISTRY_KEY);
}
