// src/features/journal/pages/CreateJournalPage.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import JournalEditor from "../components/editor/JournalEditor";
import { useCreateJournal } from "../hooks/useCreateJournal";
import { getThemeConfig } from "../utils/journalThemes";

const MOODS = [
  { key: "happy", emoji: "😊" },
  { key: "sad", emoji: "😢" },
  { key: "neutral", emoji: "😐" },
  { key: "anxious", emoji: "😰" },
  { key: "excited", emoji: "✨" },
  { key: "angry", emoji: "😡" },
  { key: "grateful", emoji: "🙏" },
  { key: "tired", emoji: "🥱" },
  { key: "reflective", emoji: "🤔" },
];

export default function CreateJournalPage() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const editorRef = useRef(null);

  const [title, setTitle] = useState("");
  const [feeling, setFeeling] = useState("neutral");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState("warm-parchment");

  const { mutateAsync: createJournal, isPending } = useCreateJournal();

  const activeMoodObj = MOODS.find((m) => m.key === feeling) || MOODS[2];
  const themeConfig = getThemeConfig(currentThemeId);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      return toast.error("Please provide an entry title.");
    }

    const editorContent = editorRef.current?.getJSON();

    const payload = {
      title: title.trim(),
      mood: feeling,
      content: editorContent || null,
      styleSettings: {
        themePreset: currentThemeId, // Sent directly without lookup maps
      },
    };

    try {
      await createJournal(payload);
      toast.success("Journal entry saved beautifully!");
      navigate("/app/journals");
    } catch (error) {
      console.error(
        "Error encountered during entry creation mutation operation:",
        error
      );
      toast.error("Failed to save entry. Please try again.");
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 px-4 py-6 selection:bg-violet-500/20 ${themeConfig.bgClass}`}
    >
      <div className="max-w-4xl mx-auto mb-4">
        <div
          className={`flex items-center justify-between gap-4 border-b pb-2 transition-colors duration-500 ${themeConfig.borderClass}`}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Thought..."
            className={`w-full bg-transparent text-xl font-bold outline-none transition-colors duration-500 placeholder-current/30 focus:ring-0 ${themeConfig.textClass}`}
          />

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border text-lg bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.08] transition-all duration-300 ${themeConfig.borderClass}`}
            >
              {activeMoodObj.emoji}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl z-50 text-white animate-in fade-in slide-in-from-top-1 duration-150">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-2 select-none">
                  How are you feeling today?
                </span>

                <div className="grid grid-cols-5 gap-1">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.key}
                      type="button"
                      onClick={() => {
                        setFeeling(mood.key);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-base transition-colors ${
                        feeling === mood.key
                          ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                          : "hover:bg-white/5 text-slate-300"
                      }`}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <JournalEditor
        ref={editorRef}
        editable={true}
        themePreset={currentThemeId}
        onThemeChange={(newThemeId) => setCurrentThemeId(newThemeId)}
        initialContent={null}
      />

      <div className="max-w-4xl mx-auto mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:text-slate-400 font-semibold text-xs text-white shadow-lg shadow-violet-600/10 transition-all tracking-wide"
        >
          {isPending ? "Saving..." : "Save Entry"}
        </button>
      </div>
    </div>
  );
}
