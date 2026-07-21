// src/features/journal/pages/JournalDetailPage.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import JournalEditor from "../components/editor/JournalEditor";
import ThemeSelector from "../components/editor/ThemeSelector";
import useJournal from "../hooks/useJournal";
import useUpdateJournal from "../hooks/useUpdateJournal";
import useDeleteJournal from "../hooks/useDeleteJournal";

// CORRECTED IMPORT PATH
import {
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
} from "../draftStorage/storage";

import { JOURNAL_THEMES } from "../utils/journalThemes";
import { JournalThemeProvider } from "../context/JournalThemeContext";
import { uploadImage } from "../api/uploadApi";

export default function JournalDetailPage() {
  const navigate = useNavigate();
  const { journalId } = useParams();
  const editorRef = useRef(null);

  const pendingFilesRef = useRef(new Map());

  const { data: journal, isLoading, isError } = useJournal(journalId);
  const updateJournalMutation = useUpdateJournal();
  const deleteJournalMutation = useDeleteJournal();

  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("neutral");
  const [initialEditorContent, setInitialEditorContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("warm-parchment");
  const [isInitialized, setIsInitialized] = useState(false);

  const [syncStatus, setSyncStatus] = useState("saved");
  const [contentVersion, setContentVersion] = useState(0);

  const applyLiveDatabaseValues = useCallback(() => {
    if (!journal) return;
    setTitle(journal.title || "");
    setMood(journal.mood || "neutral");
    setInitialEditorContent(journal.content || null);
  }, [journal]);

  // 1. Initial Load & Draft Restoration Lifecycle
  useEffect(() => {
    if (!journal || isInitialized) return;

    const existingDraft = loadDraft(journalId);

    if (existingDraft) {
      const isTitleDifferent =
        (existingDraft.title || "").trim() !== (journal.title || "").trim();
      const isContentDifferent =
        JSON.stringify(existingDraft.content) !==
        JSON.stringify(journal.content);

      if (isTitleDifferent || isContentDifferent) {
        const formattedTime = existingDraft.updatedAt
          ? new Date(existingDraft.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "earlier";

        const restoreDraft = window.confirm(
          `We found unsaved edits from ${formattedTime}. Would you like to restore your draft?`
        );

        if (restoreDraft) {
          setTitle(existingDraft.title || "");
          setMood(existingDraft.mood || journal.mood || "neutral");
          setInitialEditorContent(existingDraft.content || null);
          setIsEditing(true);
          setSyncStatus("local-saved");
        } else {
          clearDraft(journalId);
          applyLiveDatabaseValues();
        }
      } else {
        clearDraft(journalId);
        applyLiveDatabaseValues();
      }
    } else {
      applyLiveDatabaseValues();
    }

    if (journal.styleSettings?.themePreset) {
      const parsedTheme = journal.styleSettings.themePreset;
      setSelectedTheme(
        parsedTheme === "parchment" ? "warm-parchment" : parsedTheme
      );
    } else {
      setSelectedTheme("warm-parchment");
    }

    setIsInitialized(true);
  }, [journal, journalId, isInitialized, applyLiveDatabaseValues]);

  // 2. Debounced Auto-Save Effect (Only in Edit Mode)
  useEffect(() => {
    if (!isEditing || !isInitialized) return;

    if (syncStatus !== "cloud-saving") {
      setSyncStatus("saving");
    }

    const timer = setTimeout(() => {
      const currentContent = editorRef.current?.getJSON();
      if (!currentContent) return;

      const isTitleChanged = title.trim() !== (journal?.title || "").trim();
      const isContentChanged =
        JSON.stringify(currentContent) !== JSON.stringify(journal?.content);
      const isMoodChanged = mood !== (journal?.mood || "neutral");

      if (isTitleChanged || isContentChanged || isMoodChanged) {
        saveDraft(journalId, {
          title: title.trim(),
          content: currentContent,
          mood,
          type: "edit",
          themePreset: selectedTheme,
          preview: title.trim() || "Untitled Edit",
        });
        setSyncStatus("local-saved");
      } else {
        clearDraft(journalId);
        setSyncStatus("saved");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    title,
    mood,
    contentVersion,
    isEditing,
    journalId,
    isInitialized,
    journal,
    selectedTheme,
    syncStatus,
  ]);

  // 3. Safety Net: Save draft before tab close / navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isEditing) return;
      const currentContent = editorRef.current?.getJSON();
      if (!currentContent) return;

      saveDraft(journalId, {
        title: title.trim(),
        content: currentContent,
        mood,
        type: "edit",
        themePreset: selectedTheme,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing, journalId, title, mood, selectedTheme]);

  const themeConfig =
    JOURNAL_THEMES.find((t) => t.id === selectedTheme) || JOURNAL_THEMES[0];

  const processAndUploadImages = async (node) => {
    if (!node) return node;

    if (node.type === "image" && node.attrs?.src?.startsWith("blob:")) {
      const blobUrl = node.attrs.src;
      const rawFile = pendingFilesRef.current.get(blobUrl);

      if (rawFile) {
        try {
          const uploadResult = await uploadImage(rawFile);
          return {
            ...node,
            attrs: {
              ...node.attrs,
              src: uploadResult?.url,
              mediaId: uploadResult?.mediaId,
            },
          };
        } catch (uploadError) {
          console.error("Failed uploading image block node:", uploadError);
          throw new Error("Image upload failed");
        }
      }
    }

    if (node.content && Array.isArray(node.content)) {
      const updatedChildren = [];
      for (const childNode of node.content) {
        const processedChild = await processAndUploadImages(childNode);
        updatedChildren.push(processedChild);
      }
      return { ...node, content: updatedChildren };
    }

    return node;
  };

  async function handleSave() {
    try {
      const content = editorRef.current?.getJSON();
      if (!content) return toast.error("Editor content missing");

      setSyncStatus("cloud-saving");
      let fullyUploadedContent = content;

      const uploadToastId = toast.loading("Uploading images safely...");
      try {
        fullyUploadedContent = await processAndUploadImages(content);
        toast.dismiss(uploadToastId);
      } catch (err) {
        toast.dismiss(uploadToastId);
        setSyncStatus("local-saved");
        return toast.error("Failed to upload images. Please try saving again.");
      }

      await updateJournalMutation.mutateAsync({
        journalId,
        data: {
          title: title.trim(),
          content: fullyUploadedContent,
          mood,
          styleSettings: { themePreset: selectedTheme },
        },
      });

      clearDraft(journalId);
      pendingFilesRef.current.clear();
      setSyncStatus("saved");
      toast.success("Journal saved successfully ✨");
      setIsEditing(false);
    } catch (error) {
      setSyncStatus("local-saved");
      toast.error("Failed to save journal to database.");
    }
  }

  const handleCancel = () => {
    if (hasDraft(journalId)) {
      const confirmCancel = window.confirm(
        "Discard unsaved changes? This will delete your local draft."
      );
      if (!confirmCancel) return;
    }

    clearDraft(journalId);
    pendingFilesRef.current.clear();
    applyLiveDatabaseValues();
    setIsEditing(false);
    setSyncStatus("saved");
  };

  const handleDelete = async () => {
    if (!window.confirm("Permanently delete this journal entry?")) return;
    try {
      await deleteJournalMutation.mutateAsync(journalId);
      clearDraft(journalId);
      toast.success("Entry removed");
      navigate("/app/journals");
    } catch (error) {
      toast.error("Failed to delete entry.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-400 animate-pulse text-xs font-mono">
          Gathering entry...
        </p>
      </div>
    );
  }

  if (isError || !journal) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-rose-400 text-sm">Entry not found.</p>
      </div>
    );
  }

  return (
    <JournalThemeProvider themePreset={selectedTheme}>
      <div
        id="journal-fixed-container"
        className={`fixed inset-0 flex flex-col overflow-hidden transition-colors duration-500 ${themeConfig.bgClass} ${themeConfig.textClass}`}
        style={{ height: "100dvh" }}
      >
        <div className="w-full flex-1 min-h-0 flex flex-col px-4 sm:px-8 py-6">
          <div className="flex flex-col flex-1 min-h-0 max-w-2xl mx-auto w-full">
            {/* Action Header */}
            <div className="flex items-center justify-between w-full h-12 mb-6 shrink-0">
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <ThemeSelector
                    currentThemeId={selectedTheme}
                    onThemeChange={setSelectedTheme}
                    theme={themeConfig}
                  />
                ) : (
                  <div
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide uppercase bg-black/5 dark:bg-white/10 ${themeConfig.textClass}`}
                  >
                    <span className="opacity-60 mr-1">Mood:</span> {mood}
                  </div>
                )}

                {isEditing && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide opacity-70 select-none">
                    {syncStatus === "saving" && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span>Saving draft...</span>
                      </>
                    )}
                    {syncStatus === "local-saved" && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Draft saved locally</span>
                      </>
                    )}
                    {syncStatus === "cloud-saving" && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                        <span>Syncing to database...</span>
                      </>
                    )}
                    {syncStatus === "saved" && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-violet-400" />
                        <span>Synced</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="text-xs font-semibold px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-colors"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-semibold px-4 py-1.5 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Editor Container */}
            <div className="w-full flex-1 flex flex-col min-h-0 gap-3">
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      editorRef.current?.commands.focus("start");
                    }
                  }}
                  className="w-full bg-transparent text-3xl font-extrabold tracking-tight outline-none border-none p-0 focus:ring-0 focus:outline-none"
                  placeholder="Untitled Entry"
                />
              ) : (
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {title || "Untitled Entry"}
                </h1>
              )}

              <JournalEditor
                ref={editorRef}
                initialContent={initialEditorContent}
                editable={isEditing}
                onUpdate={() => setContentVersion((v) => v + 1)}
                themePreset={selectedTheme}
                pendingFilesRef={pendingFilesRef}
              />
            </div>
          </div>
        </div>
      </div>
    </JournalThemeProvider>
  );
}
