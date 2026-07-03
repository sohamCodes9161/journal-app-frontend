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
// FIXED: Import your upload image service method
import { uploadImage } from "../api/uploadApi";

export default function JournalDetailPage() {
  const navigate = useNavigate();
  const { journalId } = useParams();
  const editorRef = useRef(null);

  // FIXED: Instantiate the pending files map to track uploaded local file binaries during edits
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

  useEffect(() => {
    if (!isEditing || !isInitialized) return;

    const timeout = setTimeout(() => {
      const content = editorRef.current?.getJSON();
      if (!content) return;
      saveJournalDraft({ journalId, title, content });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, isEditing, journalId, isInitialized]);

  const themeConfig =
    JOURNAL_THEMES.find((t) => t.id === selectedTheme) || JOURNAL_THEMES[0];

  /* 
    FIXED: Deep-traversal parser to scan and substitute newly edited blob objects
    with remote server URL endpoints before database mutations execute.
  */
  const processAndUploadImages = async (node) => {
    if (!node) return node;

    if (node.type === "image" && node.attrs?.src?.startsWith("blob:")) {
      const blobUrl = node.attrs.src;
      const rawFile = pendingFilesRef.current.get(blobUrl);

      if (rawFile) {
        try {
          const uploadResult = await uploadImage(rawFile);

          // FIXED: Extract both the secure URL and the structural Media ID
          const permanentUrl = uploadResult?.url;
          const databaseMediaId = uploadResult?.mediaId;

          return {
            ...node,
            attrs: {
              ...node.attrs,
              src: permanentUrl,
              mediaId: databaseMediaId, // FIXED: Securely links database document references
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

      // Intercept data submission and handle uploads if content holds active blobs
      const uploadToastId = toast.loading(
        "Uploading new entry images safely..."
      );
      try {
        fullyUploadedContent = await processAndUploadImages(content);
        toast.dismiss(uploadToastId);
      } catch (err) {
        toast.dismiss(uploadToastId);
        return toast.error("Failed to upload entry images. Please save again.");
      }

      await updateJournalMutation.mutateAsync({
        journalId,
        data: {
          title: title.trim(),
          content: fullyUploadedContent, // FIXED: Sends safe, permanent cloud urls
          mood,
          styleSettings: { themePreset: selectedTheme },
        },
      });

      pendingFilesRef.current.clear(); // Empty the temporary layout mapping cache
      clearJournalDraft(journalId);
      toast.success("Journal saved successfully ✨");
      setIsEditing(false);
    } catch (error) {
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
          {/* Unified Action Header */}
          <div className="flex items-center justify-between w-full h-12 mb-6 shrink-0">
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

            {/* Header Operations Control Block */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      pendingFilesRef.current.clear();
                      setIsEditing(false);
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

            {/* FIXED: Passed the memory cache reference down to power the image insert tool inputs seamlessly */}
            <JournalEditor
              ref={editorRef}
              initialContent={initialEditorContent}
              editable={isEditing}
              onChange={() => {}}
              themePreset={selectedTheme}
              pendingFilesRef={pendingFilesRef}
            />
          </div>
        </div>
      </div>
    </JournalThemeProvider>
  );
}
