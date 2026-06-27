// src/features/journal/pages/JournalDetailPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Button, PageHeader } from "@/components/ui";
import JournalEditor from "../components/editor/JournalEditor";
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

export default function JournalDetailPage() {
  const navigate = useNavigate();
  const { journalId } = useParams();
  const editorRef = useRef(null);

  const { data: journal, isLoading, isError } = useJournal(journalId);
  const updateJournalMutation = useUpdateJournal();
  const deleteJournalMutation = useDeleteJournal();

  const [title, setTitle] = useState("");
  const [initialEditorContent, setInitialEditorContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("warm-parchment");
  const [isInitialized, setIsInitialized] = useState(false);

  // Synchronize initial incoming server payload data once upon component mounting
  useEffect(() => {
    if (!journal || isInitialized) return;

    const existingDraft = loadJournalDraft(journalId);
    setTitle(existingDraft?.title || journal.title || "");
    setInitialEditorContent(existingDraft?.content || journal.content || null);

    if (journal.styleSettings?.themePreset) {
      // Normalizes old legacy themes if they still exist in your database records
      const legacyMap = {
        parchment: "warm-parchment",
        midnight: "midnight-neon",
        "cosmic-dark": "midnight-neon",
        blush_pink: "sakura-dusk",
        peach_glow: "desert-sandstone",
        aqua_breeze: "ocean-serenity",
      };

      const parsedTheme =
        legacyMap[journal.styleSettings.themePreset] ||
        journal.styleSettings.themePreset;
      setSelectedTheme(parsedTheme);
    } else {
      const normalization = journal.mood?.toLowerCase() || "";
      if (["sad", "reflective", "anxious"].includes(normalization)) {
        setSelectedTheme("midnight-neon");
      } else if (
        ["happy", "grateful", "peaceful", "excited"].includes(normalization)
      ) {
        setSelectedTheme("floral-sanctuary");
      } else {
        setSelectedTheme("warm-parchment");
      }
    }

    setIsInitialized(true);
  }, [journal, journalId, isInitialized]);

  // Periodic Local Auto-Save Draft Routine
  useEffect(() => {
    if (!isEditing || !isInitialized) return;

    const timeout = setTimeout(() => {
      const content = editorRef.current?.getJSON();
      if (!content) return;

      saveJournalDraft({
        journalId,
        title,
        content,
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, isEditing, journalId, isInitialized]);

  const themeConfig =
    JOURNAL_THEMES.find((t) => t.id === selectedTheme) || JOURNAL_THEMES[0];

  async function handleSave() {
    try {
      const content = editorRef.current?.getJSON();
      if (!content) return toast.error("Editor content missing");

      await updateJournalMutation.mutateAsync({
        journalId,
        data: {
          title: title.trim(),
          content,
          styleSettings: {
            themePreset: selectedTheme, // Sent cleanly without maps
          },
        },
      });

      clearJournalDraft(journalId);
      toast.success("Journal saved successfully ✨");
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Error encountered during update mutation save operation:",
        error
      );
      toast.error("Failed to save journal");
    }
  }

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this journal permanently?"
      )
    )
      return;

    try {
      await deleteJournalMutation.mutateAsync(journalId);
      toast.success("Entry removed completely");
      navigate("/app/journals");
    } catch (error) {
      toast.error("Failed to delete journal entry.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-400 animate-pulse text-xs font-mono">
          Gathering thoughts...
        </p>
      </div>
    );
  }

  if (isError || !journal) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-rose-400 font-medium text-sm">
          Journal entry could not be found.
        </p>
      </div>
    );
  }

  return (
    <JournalThemeProvider themePreset={selectedTheme}>
      <div
        className={`min-h-screen w-full transition-colors duration-500 px-4 py-6 selection:bg-violet-500/20 ${themeConfig.bgClass}`}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <PageHeader
            title="Your Reflection"
            description="Revisit thoughts, emotions, and moments."
            className={`pb-2 transition-colors duration-500 ${themeConfig.textClass}`}
          />

          <div
            className={`w-full block transition-colors duration-500 border-b pb-6 ${themeConfig.borderClass}`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-4 flex-1 w-full">
                <div
                  className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold tracking-wide uppercase shadow-sm backdrop-blur-md select-none transition-colors duration-500 ${
                    themeConfig.isDark
                      ? "border-white/10 bg-white/5 text-slate-200"
                      : `${themeConfig.borderClass} bg-black/5 ${themeConfig.textClass}`
                  }`}
                >
                  <span className={`mr-1.5 ${themeConfig.mutedClass}`}>
                    Mood:
                  </span>
                  {journal.mood || "neutral"}
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full bg-transparent text-2xl font-bold tracking-tight outline-none border-b pb-1 transition-colors duration-500 focus:ring-0 ${themeConfig.borderClass} ${themeConfig.textClass}`}
                    placeholder="Entry title..."
                  />
                ) : (
                  <h1
                    className={`text-2xl font-bold tracking-tight transition-colors duration-500 ${themeConfig.textClass}`}
                  >
                    {title || "Untitled Entry"}
                  </h1>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      className={`text-xs transition-colors duration-500 ${themeConfig.mutedClass} hover:opacity-80`}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={updateJournalMutation.isPending}
                      className="text-xs bg-violet-600 hover:bg-violet-700 text-white shadow-md"
                    >
                      {updateJournalMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className={`text-xs transition-colors duration-500 ${themeConfig.mutedClass} hover:opacity-80`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      disabled={deleteJournalMutation.isPending}
                      className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                    >
                      {deleteJournalMutation.isPending
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <JournalEditor
            ref={editorRef}
            initialContent={initialEditorContent}
            editable={isEditing}
            onChange={() => {}}
            onThemeChange={(newThemeId) => setSelectedTheme(newThemeId)}
            themePreset={selectedTheme}
          />
        </div>
      </div>
    </JournalThemeProvider>
  );
}
