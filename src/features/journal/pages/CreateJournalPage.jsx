// src/features/journal/pages/CreateJournalPage.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 🌟 Imported for redirection
import { toast } from "react-hot-toast"; // 🌟 Imported for success/error toasters
import JournalEditor from "../components/editor/JournalEditor";
import { useCreateJournal } from "../hooks/useCreateJournal";

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

  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // 🌟 Initialize navigation hook
  const { mutateAsync: createJournal, isPending } = useCreateJournal();

  const activeMoodObj = MOODS.find((m) => m.key === feeling) || MOODS[2];

  // Auto-close popover when clicking anywhere else
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
    };

    try {
      // 1. Wait for the database write to successfully finish
      await createJournal(payload);

      // 2. Fire the success toaster notification
      toast.success("Journal entry saved beautifully!");

      // 3. Instantly redirect back to your main feed path
      navigate("/app/journals");
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Failed to save entry. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white selection:bg-violet-500/30">
      <div className="max-w-4xl mx-auto mb-4">
        {/* HYPER-COMPACT INLINE HEADER ROW */}
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-2">
          {/* Left Side: Minimal Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Thought..."
            className="w-full bg-transparent text-lg font-bold text-white placeholder-slate-700 outline-none"
          />

          {/* Right Side: Stealth Micro Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 text-lg transition-all"
            >
              {activeMoodObj.emoji}
            </button>

            {/* Floating Dropdown Canvas */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
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
                            ? "bg-violet-600 text-white"
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

      {/* Pure Content Workspace */}
      <JournalEditor editable={true} onChange={setEditorContent} />

      {/* Absolute Minimum Footprint Action Button */}
      <div className="max-w-4xl mx-auto mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:text-slate-400 font-semibold text-xs transition-all tracking-wide"
        >
          {isPending ? "Saving..." : "Save Entry"}
        </button>
      </div>
    </div>
  );
}
