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
  const [title, setTitle] = useState("");
  const [feeling, setFeeling] = useState("neutral");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editorContent, setEditorContent] = useState(null);
  const [currentThemeId, setCurrentThemeId] = useState("parchment");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
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

  const handleMoodSelect = (moodKey) => {
    setFeeling(moodKey);
    setIsDropdownOpen(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please provide an entry title.");
      return;
    }

    const payload = {
      title: title,
      mood: feeling,
      content: editorContent,
      theme: currentThemeId,
    };

    try {
      await createJournal(payload);
      toast.success("Journal entry saved beautifully!");
      navigate("/app/journals");
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Failed to save entry. Please try again.");
    }
  };

  return (
    /* 🎨 Background tint updates perfectly across the whole viewport wrapper */
    <div
      className={`min-h-screen w-full transition-colors duration-500 px-4 py-6 selection:bg-violet-500/20 ${themeConfig.bgClass}`}
    >
      <div className="max-w-4xl mx-auto mb-4">
        {/* Header Row Divider matches theme accents */}
        <div
          className={`flex items-center justify-between gap-4 border-b pb-2 transition-colors duration-500 ${themeConfig.borderClass}`}
        >
          {/* 🎨 Title Input: Completely isolated theme typography container */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Thought..."
            className={`w-full bg-transparent text-xl font-bold outline-none transition-colors duration-500 ${themeConfig.textClass}`}
          />

          {/* Mood Selector Trigger: Protected from canvas typography styles */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border text-lg bg-black/[0.03] hover:bg-black/[0.08] transition-all duration-300 ${themeConfig.borderClass}`}
            >
              {activeMoodObj.emoji}
            </button>

            {/* Dropdown UI: Explicitly styled dark slate container so text/buttons never glitch out */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-white">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-2 select-none">
                  How are you feeling today?
                </span>

                <div className="grid grid-cols-5 gap-1">
                  {MOODS.map((mood) => {
                    const isCurrent = feeling === mood.key;
                    return (
                      <button
                        key={mood.key}
                        type="button"
                        onClick={() => handleMoodSelect(mood.key)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-base transition-colors ${
                          isCurrent
                            ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                            : "hover:bg-white/5 text-slate-300"
                        }`}
                      >
                        {mood.emoji}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Engine Interface */}
      <JournalEditor
        editable={true}
        themePreset={currentThemeId}
        onThemeChange={(newThemeId) => setCurrentThemeId(newThemeId)}
        onChange={setEditorContent}
      />

      {/* Submit Action Block */}
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
