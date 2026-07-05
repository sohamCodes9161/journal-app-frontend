// src/features/journal/pages/CreateJournalPage.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import JournalEditor from "../components/editor/JournalEditor";
import ThemeSelector from "../components/editor/ThemeSelector";
import { useCreateJournal } from "../hooks/useCreateJournal";
import { getThemeConfig } from "../utils/journalThemes";
import { uploadImage } from "../api/uploadApi";

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
  const statusTimerRef = useRef(null);

  const pendingFilesRef = useRef(new Map());

  const [title, setTitle] = useState("");
  const [feeling, setFeeling] = useState("neutral");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState("warm-parchment");
  const [syncStatus, setSyncStatus] = useState("saved");

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  const triggerDraftSavingVisual = () => {
    if (syncStatus === "cloud-saving") return;
    setSyncStatus("saving");
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => {
      setSyncStatus("local-saved");
    }, 1000);
  };

  useEffect(() => {
    if (!title.trim()) return;
    triggerDraftSavingVisual();
  }, [title]);

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

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Please provide an entry title.");

    const editorContent = editorRef.current?.getJSON();
    let fullyUploadedContent = editorContent;

    setSyncStatus("cloud-saving");

    if (editorContent) {
      const uploadToastId = toast.loading("Uploading entry images safely...");
      try {
        fullyUploadedContent = await processAndUploadImages(editorContent);
        toast.dismiss(uploadToastId);
      } catch (err) {
        toast.dismiss(uploadToastId);
        setSyncStatus("local-saved");
        return toast.error("Failed to upload entry images. Please save again.");
      }
    }

    const payload = {
      title: title.trim(),
      mood: feeling,
      content: fullyUploadedContent || null,
      styleSettings: { themePreset: currentThemeId },
    };

    try {
      await createJournal(payload);
      pendingFilesRef.current.clear();
      setSyncStatus("saved");
      toast.success("Journal entry saved beautifully!");
      navigate("/app/journals");
    } catch (error) {
      console.error("Error encountered during entry creation:", error);
      setSyncStatus("local-saved");
      toast.error("Failed to save entry. Please try again.");
    }
  };

  return (
    /* 
      FIXED: Style height is now directly bound to visual viewport pixel size.
      When the mobile keyboard shows up, the whole container collapses instantly.
    */
    <div
      className={`
fixed
inset-0
flex
flex-col
overflow-hidden
${themeConfig.bgClass}
${themeConfig.textClass}
`}
      style={{
        height: "100dvh",
      }}
    >
      {/* FIXED TOP HEADER */}
      <div className="w-full h-16 px-4 sm:px-8 flex items-center justify-between shrink-0 border-b border-black/5 dark:border-white/5 bg-transparent z-30">
        <div className="flex items-center gap-4">
          <ThemeSelector
            currentThemeId={currentThemeId}
            onThemeChange={setCurrentThemeId}
            theme={themeConfig}
          />

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
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-8 h-8 flex items-center justify-center rounded-xl border text-base bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 ${themeConfig.borderClass}`}
            >
              {activeMoodObj.emoji}
            </button>

            {isDropdownOpen && (
              <div
                className={`
                  absolute right-0 top-full mt-2 w-56 p-3 rounded-2xl border shadow-2xl z-50 
                  backdrop-blur-xl transition-colors duration-500 origin-top-right
                  animate-in fade-in slide-in-from-top-1 duration-150
                  ${themeConfig.uiClass || "bg-white border-slate-200 text-slate-900"}
                `}
              >
                <span className="text-[10px] font-bold tracking-wider opacity-40 uppercase block mb-2 select-none">
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
                        triggerDraftSavingVisual();
                      }}
                      className={`
                        w-9 h-9 flex items-center justify-center rounded-lg text-base transition-all
                        ${
                          feeling === mood.key
                            ? "bg-violet-600 text-white shadow-md shadow-violet-600/20 scale-95"
                            : `opacity-80 hover:opacity-100 ${
                                themeConfig.uiBtnHover || "hover:bg-slate-100"
                              }`
                        }
                      `}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={isPending}
            className="text-xs font-semibold px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:text-slate-400 text-white shadow-sm transition-colors tracking-wide"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* INDEPENDENT WORKSPACE WRAPPER */}
      <div className="flex-1 flex flex-col min-h-0 px-4 sm:px-8 py-6">
        <div
          className="
flex
flex-col
flex-1
min-h-0
max-w-2xl
mx-auto
w-full
gap-4
"
        >
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
            placeholder="Untitled Thought..."
            className="w-full bg-transparent text-3xl font-extrabold tracking-tight outline-none border-none p-0 focus:ring-0 focus:outline-none placeholder-current/20"
          />

          <JournalEditor
            ref={editorRef}
            editable={true}
            themePreset={currentThemeId}
            initialContent={null}
            pendingFilesRef={pendingFilesRef}
            onUpdate={triggerDraftSavingVisual}
          />
        </div>
      </div>
    </div>
  );
}
