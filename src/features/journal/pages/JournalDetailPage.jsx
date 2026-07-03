// src/features/journal/pages/JournalDetailPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
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
      const legacyMap = {
        parchment: "warm-parchment",
        midnight: "midnight",
        "cosmic-dark": "midnight",
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
        setSelectedTheme("midnight");
      } else if (
        ["happy", "grateful", "peaceful", "excited"].includes(normalization)
      ) {
        setSelectedTheme("sakura-dusk");
      } else {
        setSelectedTheme("warm-parchment");
      }
    }

    setIsInitialized(true);
  }, [journal, journalId, isInitialized]);

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
          mood: mood,
          styleSettings: {
            themePreset: selectedTheme,
          },
        },
      });

      clearJournalDraft(journalId);
      toast.success("Journal saved successfully ✨");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
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
        className={`min-h-screen w-full transition-colors duration-500 px-0 sm:px-6 py-6 selection:bg-violet-500/20 ${themeConfig.bgClass} ${themeConfig.textClass}`}
      >
        <div className="max-w-3xl mx-auto space-y-6 px-4 sm:px-0">
          <div
            className={`w-full block transition-colors duration-500 border-b pb-4 ${themeConfig.borderClass}`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between w-full">
                {/* Mood Tag Display */}
                <div
                  className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold tracking-wide uppercase shadow-sm select-none transition-colors duration-500 ${
                    themeConfig.isDark
                      ? "border-white/10 bg-white/5 text-slate-200"
                      : `${themeConfig.borderClass} bg-black/5 ${themeConfig.textClass}`
                  }`}
                >
                  <span className={`mr-1.5 ${themeConfig.mutedClass}`}>
                    Mood:
                  </span>
                  {mood}
                </div>

                {/* Theme-Aware Contextual Buttons */}
                <div className="flex items-center gap-2.5">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
                          themeConfig.isDark
                            ? "text-slate-300 border-white/10 hover:bg-white/5"
                            : "text-slate-700 border-black/10 hover:bg-black/5"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={updateJournalMutation.isPending}
                        className="text-xs font-semibold px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-all disabled:opacity-50"
                      >
                        {updateJournalMutation.isPending ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all shadow-sm ${
                          themeConfig.isDark
                            ? "text-slate-200 border-white/10 bg-white/5 hover:bg-white/10"
                            : "text-slate-800 border-black/15 bg-black/[0.02] hover:bg-black/5"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleteJournalMutation.isPending}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                          themeConfig.isDark
                            ? "text-rose-400 border-rose-500/20 hover:bg-rose-500/10"
                            : "text-rose-600 border-rose-200 bg-rose-50/50 hover:bg-rose-100/70"
                        }`}
                      >
                        {deleteJournalMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Title Input Frame */}
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
          </div>

          {/* 
            FIXED: Removed the <FeelingSelector /> layout tray entirely from here.
            Mood changes are now exclusively handled inside the new creation mode flows.
          */}

          {/* Canvas Wrapper */}
          <div className="w-full block transition-colors duration-500">
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
      </div>
    </JournalThemeProvider>
  );
}
