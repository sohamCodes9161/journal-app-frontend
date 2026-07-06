import { useEffect, useRef } from "react";
import {
  saveDraft,
  clearDraft,
  upsertDraftIndex,
  removeDraftFromIndex,
} from "../draftStorage/storage";

function isMeaningfulDraft({ title, mood, content, themePreset }) {
  const hasTitle = title.trim().length > 0;

  const hasText =
    content?.content?.some((node) =>
      node.content?.some((child) => child.text?.trim().length > 0)
    ) ?? false;

  const hasImage =
    content?.content?.some((node) => node.type === "image") ?? false;

  const moodChanged = mood !== "neutral";

  const themeChanged = themePreset !== "midnight-ink";

  return hasTitle || hasText || hasImage || moodChanged || themeChanged;
}

export default function useJournalDraft({
  draftKey,
  enabled,
  title,
  mood,
  content,
  themePreset,
}) {
  const firstRun = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    const draft = {
      title,
      mood,
      content,
      themePreset,
    };

    const timer = setTimeout(() => {
      if (
        isMeaningfulDraft({
          title,
          mood,
          content,
          themePreset,
        })
      ) {
        saveDraft(draftKey, draft);

        upsertDraftIndex({
          id: draftKey,
          title,
          mood,
          themePreset,
          preview:
            content?.content?.[0]?.content
              ?.map((node) => node.text || "")
              .join("")
              .slice(0, 120) || "",
          type: "create",
        });
      } else {
        clearDraft(draftKey);
        removeDraftFromIndex(draftKey);
      }
    }, 800);

    const saveImmediately = () => {
      clearTimeout(timer);
      if (
        isMeaningfulDraft({
          title,
          mood,
          content,
          themePreset,
        })
      ) {
        saveDraft(draftKey, draft);

        upsertDraftIndex({
          id: draftKey,
          title,
          mood,
          themePreset,
          preview:
            content?.content?.[0]?.content
              ?.map((node) => node.text || "")
              .join("")
              .slice(0, 120) || "",
          type: "create",
        });
      } else {
        clearDraft(draftKey);
        removeDraftFromIndex(draftKey);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        saveImmediately();
      }
    };

    window.addEventListener("beforeunload", saveImmediately);
    window.addEventListener("pagehide", saveImmediately);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimeout(timer);

      window.removeEventListener("beforeunload", saveImmediately);
      window.removeEventListener("pagehide", saveImmediately);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [draftKey, enabled, title, mood, content, themePreset]);

  return {
    removeDraft: () => {
      clearDraft(draftKey);
      removeDraftFromIndex(draftKey);
    },
  };
}
