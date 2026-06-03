import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Button, Input, PageHeader } from "@/components/ui";
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

function JournalDetailPage() {
  const navigate = useNavigate();
  const { journalId } = useParams();
  const editorRef = useRef(null);

  const { data: journal, isLoading, isError } = useJournal(journalId);
  const updateJournalMutation = useUpdateJournal();
  const deleteJournalMutation = useDeleteJournal();

  const [title, setTitle] = useState("");
  const [initialEditorContent, setInitialEditorContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Local Customization States
  const [selectedTheme, setSelectedTheme] = useState("cosmic-dark");
  const [layoutWidth, setLayoutWidth] = useState("max-w-5xl");

  useEffect(() => {
    if (!journal) return;

    // Load theme configuration from database if it exists
    if (journal.styleSettings?.themePreset) {
      setSelectedTheme(journal.styleSettings.themePreset);
    } else if (
      ["sad", "reflective", "anxious"].includes(journal.mood?.toLowerCase())
    ) {
      setSelectedTheme("cosmic-dark");
    } else if (
      ["happy", "grateful", "peaceful"].includes(journal.mood?.toLowerCase())
    ) {
      setSelectedTheme("floral-sanctuary");
    } else {
      setSelectedTheme("minimal-matte");
    }

    if (journal.styleSettings?.layoutWidth) {
      setLayoutWidth(journal.styleSettings.layoutWidth);
    }
  }, [journal]);

  // ✅ SAFEFALL BACK FIX: Added deep nested chaining protection to completely avoid the 'pageBg' crash
  const currentStyle = JOURNAL_THEMES?.[selectedTheme] ||
    JOURNAL_THEMES?.["minimal-matte"] || {
      pageBg: "bg-slate-950",
      textStyle: "text-slate-200",
      editorCanvas: "bg-slate-900/50 border-white/10",
      accentGlow: "opacity-0",
    };

  // 🌍 GLOBAL BACKGROUND FORCE INJECTOR: This maps the flowers/images to the outer body wrapper frame
  useEffect(() => {
    if (!currentStyle?.pageBg) return;

    // Keep track of whatever setup the app layout had before
    const originalBodyClasses = document.body.className;

    // Inject our image parameters directly into the DOM window root
    document.body.classList.add(...currentStyle.pageBg.split(" "));

    // Cleanup: Reset body wrapper back to system styles when navigating away
    return () => {
      currentStyle.pageBg.split(" ").forEach((className) => {
        document.body.classList.remove(className);
      });
      if (originalBodyClasses) {
        document.body.className = originalBodyClasses;
      }
    };
  }, [currentStyle]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this journal permanently?"
      )
    )
      return;

    try {
      await deleteJournalMutation.mutateAsync(journalId);
      navigate("/app/journals");
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      toast.error("Failed to delete journal entry.");
    }
  };

  useEffect(() => {
    if (!journal) return;
    const existingDraft = loadJournalDraft(journalId);

    setTitle(existingDraft?.title || journal.title);
    setInitialEditorContent(existingDraft?.content || journal.content);
  }, [journal, journalId]);

  useEffect(() => {
    if (!isEditing) return;

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
  }, [title, isEditing, journalId]);

  async function handleSave() {
    try {
      const content = editorRef.current?.getJSON();
      if (!content) return toast.error("Editor content missing");

      // ✅ FIX: Saving selection customizations down to backend server database
      await updateJournalMutation.mutateAsync({
        journalId,
        data: {
          title,
          content,
          styleSettings: {
            themePreset: selectedTheme,
            layoutWidth: layoutWidth,
          },
        },
      });

      clearJournalDraft(journalId);
      toast.success("Journal saved successfully ✨");
      setIsEditing(false);

      // Removed your navigate out timeout so you stay right on the detail page to view it!
    } catch (error) {
      toast.error("Failed to save journal");
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-400">Loading journal...</p>
      </div>
    );
  }

  if (isError || !journal) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-red-400">Journal not found.</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen transition-all duration-700 rounded-[32px] p-1`}
    >
      <div
        className={`mx-auto ${layoutWidth} space-y-8 p-4 sm:p-6 transition-all duration-500 ${currentStyle.textStyle}`}
      >
        <PageHeader
          title="Your Reflection"
          description="Revisit thoughts, emotions, and moments."
        />

        {/* Customization Drawer / Control Dock */}
        {isEditing && (
          <div className="border border-white/10 bg-black/50 p-5 rounded-2xl flex flex-wrap gap-6 items-center backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Theme Preset Selector */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                Visual Theme Preset
              </span>
              <div className="flex flex-wrap gap-2">
                {JOURNAL_THEMES &&
                  Object.entries(JOURNAL_THEMES).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-200 ${
                        selectedTheme === key
                          ? "bg-white text-slate-950 border-white shadow-lg"
                          : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {value.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Canvas Width Options Selector */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                Layout Canvas Width
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "max-w-3xl", label: "Focused & Cozy" },
                  { key: "max-w-5xl", label: "Standard Balanced" },
                  { key: "max-w-7xl", label: "Expansive View" },
                ].map((width) => (
                  <button
                    key={width.key}
                    onClick={() => setLayoutWidth(width.key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-200 ${
                      layoutWidth === width.key
                        ? "bg-white text-slate-950 border-white shadow-lg"
                        : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {width.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Canvas Container Block */}
        <div
          className={`
            rounded-[32px]
            border
            p-8
            shadow-[0_0_60px_rgba(0,0,0,0.35)]
            backdrop-blur-xl
            transition-all
            duration-500
            relative
            overflow-hidden
            ${currentStyle.editorCanvas}
          `}
        >
          {/* Subtle Ambient Glow Background Layers */}
          <div
            className={`absolute inset-0 pointer-events-none bg-gradient-to-br transition-opacity duration-700 ${currentStyle.accentGlow}`}
          />

          <div className="relative z-10 flex flex-col gap-8">
            {/* Top Section Actions Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              {/* Left Column: Mood Badge & Interactive Title Input */}
              <div className="space-y-4 flex-1 w-full">
                <div
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.05]
                    px-4
                    py-1.5
                    text-sm
                    font-medium
                    text-slate-300
                    backdrop-blur-sm
                    capitalize
                  "
                >
                  {journal.mood || "neutral"}
                </div>

                {isEditing ? (
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-3xl font-bold bg-white/5 border-white/10 text-white w-full h-auto py-2 px-3 rounded-xl"
                  />
                ) : (
                  <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white">
                    {title || "Untitled Entry"}
                  </h1>
                )}
              </div>

              {/* Right Column: Unified Top Right Control Actions */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-start">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleDelete}
                      disabled={deleteJournalMutation.isPending}
                      className="
                        flex 
                        items-center 
                        gap-2 
                        px-4 
                        py-2.5 
                        rounded-xl 
                        bg-rose-500/10 
                        border 
                        border-rose-500/20 
                        text-rose-400 
                        text-sm
                        font-medium
                        transition-all 
                        duration-200 
                        hover:bg-rose-500 
                        hover:text-white 
                        disabled:opacity-50
                      "
                    >
                      {deleteJournalMutation.isPending ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      )}
                      {deleteJournalMutation.isPending
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                    <Button onClick={() => setIsEditing(true)}>
                      Edit Journal
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      isLoading={updateJournalMutation.isPending}
                    >
                      Save Changes
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Entry Metadata Row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="rounded-full bg-white/[0.04] px-3 py-1">
                {new Date(journal.createdAt).toLocaleDateString()}
              </span>
              <span className="rounded-full bg-white/[0.04] px-3 py-1">
                {journal.wordCount || 0} words
              </span>
              <span className="rounded-full bg-white/[0.04] px-3 py-1 capitalize">
                {journal.category || "General"}
              </span>
            </div>

            {/* Tag Badges */}
            {journal.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {journal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="
                      rounded-full
                      border
                      border-violet-500/20
                      bg-violet-500/10
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-violet-200
                    "
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Text Editor Canvas Interface */}
          <div className="mt-8 relative z-10">
            <JournalEditor
              ref={editorRef}
              initialContent={initialEditorContent}
              editable={isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalDetailPage;
