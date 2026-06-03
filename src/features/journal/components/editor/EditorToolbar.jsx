import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Type,
  Undo,
  Redo,
  ImageIcon,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { CUSTOM_EMOJIS, EMOJI_CATEGORIES } from "../../utils/customEmojis";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const FONT_SIZES = [
  { label: "Small (12px)", value: "12px" },
  { label: "Normal (14px)", value: "14px" },
  { label: "Medium (16px)", value: "16px" },
  { label: "Large (18px)", value: "18px" },
  { label: "X-Large (24px)", value: "24px" },
  { label: "Heading (32px)", value: "32px" },
];

function ToolbarButton({ onClick, isActive, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`
        w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200
        ${
          isActive
            ? "bg-violet-500 text-white shadow-md shadow-violet-500/20 scale-95"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
        }
      `}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-white/10 self-center mx-1 select-none" />;
}

/**
 * EditorToolbar
 *
 * Props:
 *  - editor          : TipTap editor instance
 *  - pendingFilesRef : React ref holding a Map<blobUrl, File>
 *                      Populated here when user picks a file.
 *                      Consumed by the save handler in the parent page.
 */
function EditorToolbar({ editor, pendingFilesRef }) {
  const fileInputRef = useRef(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState("faces");
  const pickerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Force re-render on every editor transaction so toolbar highlights stay in sync
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const forceRerender = () => setTick((t) => t + 1);
    editor.on("transaction", forceRerender);
    return () => editor.off("transaction", forceRerender);
  }, [editor]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  if (!editor) return null;

  // ─── Emoji helpers ────────────────────────────────────────────────────────

  const handleTabClick = (categoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`emoji-section-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    let currentActive = EMOJI_CATEGORIES[0].id;

    for (const cat of EMOJI_CATEGORIES) {
      const el = document.getElementById(`emoji-section-${cat.id}`);
      if (el) {
        const relativeTop = el.offsetTop - container.offsetTop;
        if (container.scrollTop >= relativeTop - 15) {
          currentActive = cat.id;
        }
      }
    }
    setActiveCategory(currentActive);
  };

  const handleSelectEmoji = (emoji) => {
    editor
      .chain()
      .focus()
      .insertEmoji({ src: emoji.url, alt: emoji.name })
      .run();
  };

  // ─── Font size helpers ────────────────────────────────────────────────────

  const getCurrentFontSize = () => {
    for (const sizeOption of FONT_SIZES) {
      if (editor.isActive("fontSize", { size: sizeOption.value })) {
        return sizeOption.value;
      }
    }
    return "14px";
  };

  const handleFontSizeChange = (value) => {
    if (value === "clear") {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(value).run();
    }
  };

  // ─── Image pick → local blob preview (NO Cloudinary call here) ───────────

  function handleImageButtonClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, and WebP files are allowed.");
      event.target.value = "";
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      event.target.value = "";
      return;
    }

    // Create a local object URL for instant preview — no upload yet
    const blobUrl = URL.createObjectURL(file);

    // Store the File in the pending map so the save handler can upload it later
    if (pendingFilesRef?.current) {
      pendingFilesRef.current.set(blobUrl, file);
    }

    // Insert into editor using the blob URL — renders instantly
    editor
      .chain()
      .focus()
      .setImage({ src: blobUrl, mediaId: null })
      .createParagraphNear()
      .focus()
      .run();

    // Clear the input so the same file can be picked again if needed
    event.target.value = "";
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Main toolbar strip */}
      <div
        className="
          sticky top-4 z-10 flex items-center gap-1 rounded-2xl border border-white/10
          bg-slate-950/40 p-1.5 backdrop-blur-xl w-max max-w-full overflow-x-auto scrollbar-none
        "
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Font size selector */}
        <div className="relative flex items-center px-1">
          <select
            value={getCurrentFontSize()}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="bg-white/5 border border-white/10 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 pr-6 outline-none appearance-none cursor-pointer hover:bg-white/10 transition font-medium focus:border-violet-500"
            title="Text Font Size"
          >
            {FONT_SIZES.map((size) => (
              <option
                key={size.value}
                value={size.value}
                className="bg-slate-900 text-slate-200"
              >
                {size.label}
              </option>
            ))}
            <option
              value="clear"
              className="bg-slate-900 text-violet-400 font-semibold"
            >
              ✨ Reset Size
            </option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[9px]">
            ▼
          </div>
        </div>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={
            editor.isActive("paragraph") && !editor.isActive("fontSize")
          }
          title="Normal Text"
        >
          <Type size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <Underline size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          title="Highlight"
        >
          <Highlighter size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Image button — triggers local blob preview only */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleImageButtonClick}
          title="Insert Image or GIF"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
        >
          <ImageIcon size={16} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Emoji picker */}
      <div className="relative" ref={pickerRef}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`px-4 h-9 flex items-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 border border-white/10 ${
            showEmojiPicker
              ? "bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-600/20"
              : "bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          <span>🥰</span>
          <span className="text-xs">Emojis</span>
        </button>

        {showEmojiPicker && (
          <div className="absolute right-0 top-full mt-3 z-50 w-80 p-4 rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-2xl shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-3 duration-200 text-white">
            <div className="flex gap-1 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
              {EMOJI_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleTabClick(cat.id)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "bg-violet-500 text-white shadow"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-1 scroll-smooth"
              style={{ scrollbarWidth: "thin" }}
            >
              {EMOJI_CATEGORIES.map((category) => {
                const emojisInSection = CUSTOM_EMOJIS.filter(
                  (e) => e.category === category.id
                );
                return (
                  <div
                    key={category.id}
                    id={`emoji-section-${category.id}`}
                    className="pt-1"
                  >
                    <div className="text-[10px] uppercase tracking-wider font-extrabold text-violet-400 mb-2 sticky top-0 bg-slate-950/90 py-1 backdrop-blur-sm">
                      {category.label}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {emojisInSection.map((emoji) => (
                        <button
                          key={emoji.name}
                          type="button"
                          onClick={() => handleSelectEmoji(emoji)}
                          className="p-1.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-white/20 active:scale-90 transition-all duration-150 flex items-center justify-center group"
                          title={emoji.name}
                        >
                          <img
                            src={emoji.url}
                            alt={emoji.name}
                            className="w-9 h-9 object-contain pointer-events-none group-hover:scale-110 transition-transform duration-200"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[10px] text-center text-slate-500 border-t border-white/5 pt-2 select-none">
              Scroll freely across categories
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditorToolbar;
