// src/features/journal/pages/JournalDetailPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import JournalEditor from "../components/editor/JournalEditor";
import ThemeSelector from "../components/editor/ThemeSelector";
import useJournal from "../hooks/useJournal";
import useUpdateJournal from "../hooks/useUpdateJournal";
import useDeleteJournal from "../hooks/useDeleteJournal";
import {
  saveJournalDraft,
  loadJournalDraft,
  clearJournalDraft,
} from "../utils/journalDraftStorage";
import { JOURNAL_THEMES } from "../utils/journalThemes";
import { JournalThemeProvider } from "../context/JournalThemeContext";
import { uploadImage } from "../api/uploadApi";

export default function JournalDetailPage() {
  const navigate = useNavigate();
  const { journalId } = useParams();
  const editorRef = useRef(null);

  // Tracks uploaded local file binaries during edits
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

  // NEW: Tracks local draft state versions & cloud synchronization progress
  const [syncStatus, setSyncStatus] = useState("saved");
  const [contentVersion, setContentVersion] = useState(0);

  useEffect(() => {
    if (!journal || isInitialized) return;

    const existingDraft = loadJournalDraft(journalId);
    setTitle(existingDraft?.title || journal.title || "");
    setMood(journal.mood || "neutral");
    setInitialEditorContent(existingDraft?.content || journal.content || null);

    if (journal.styleSettings?.themePreset) {
      const parsedTheme = journal.styleSettings.themePreset;
      setSelectedTheme(
        parsedTheme === "parchment" ? "warm-parchment" : parsedTheme
      );
    } else {
      setSelectedTheme("warm-parchment");
    }

    setIsInitialized(true);
  }, [journal, journalId, isInitialized]);

  // NEW: Refactored draft effect that actively syncs status indicators while typing
  useEffect(() => {
    if (!isEditing || !isInitialized) return;

    if (syncStatus !== "cloud-saving") {
      setSyncStatus("saving");
    }

    const timeout = setTimeout(() => {
      const content = editorRef.current?.getJSON();
      if (!content) return;

      saveJournalDraft({ journalId, title, content });
      setSyncStatus("local-saved");
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, contentVersion, isEditing, journalId, isInitialized]);

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
          const permanentUrl = uploadResult?.url;
          const databaseMediaId = uploadResult?.mediaId;

          return {
            ...node,
            attrs: {
              ...node.attrs,
              src: permanentUrl,
              mediaId: databaseMediaId,
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

      let fullyUploadedContent = content;

      // Set state to cloud syncing phase
      setSyncStatus("cloud-saving");

      const uploadToastId = toast.loading(
        "Uploading new entry images safely..."
      );
      try {
        fullyUploadedContent = await processAndUploadImages(content);
        toast.dismiss(uploadToastId);
      } catch (err) {
        toast.dismiss(uploadToastId);
        setSyncStatus("local-saved");
        return toast.error("Failed to upload entry images. Please save again.");
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

      pendingFilesRef.current.clear();
      clearJournalDraft(journalId);
      setSyncStatus("saved");
      toast.success("Journal saved successfully ✨");
      setIsEditing(false);
    } catch (error) {
      setSyncStatus("local-saved");
      toast.error("Failed to save journal");
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Permanently delete this journal entry?")) return;
    try {
      await deleteJournalMutation.mutateAsync(journalId);
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
        className={`fixed inset-0 w-full h-full overflow-y-auto transition-colors duration-500 px-4 sm:px-8 py-6 selection:bg-violet-500/20 ${themeConfig.bgClass} ${themeConfig.textClass}`}
      >
        <div className="max-w-2xl mx-auto flex flex-col min-h-full pb-24">
          {/* Unified Action Header Bar */}
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

              {/* NEW: Live Visual Sync Engine Dot Display */}
              {isEditing && (
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold tracking-wide opacity-50 select-none transition-all duration-300">
                  {syncStatus === "saving" && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>Saving draft...</span>
                    </>
                  )}
                  {syncStatus === "local-saved" && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Draft saved locally</span>
                    </>
                  )}
                  {syncStatus === "cloud-saving" && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
                      <span>Syncing with cloud...</span>
                    </>
                  )}
                  {syncStatus === "saved" && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      <span>Cloud synced ✨</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Header Operations Control Block */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      pendingFilesRef.current.clear();
                      setIsEditing(false);
                      setSyncStatus("saved");
                    }}
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

          {/* Continuous Canvas Block */}
          <div className="w-full flex-1 flex flex-col gap-3">
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

            {/* NEW: Passed content updates up into the version ticker to trigger state updates */}
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
    </JournalThemeProvider>
  );
}
