// Force fresh deployment update 1

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

function ToolbarButton({ onClick, isActive, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`
        w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-all duration-200 shrink-0 snap-center
        ${
          isActive
            ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400 font-bold shadow-sm scale-95"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }
      `}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return (
    <div
      className="w-px h-4 self-center mx-1 select-none bg-slate-200 dark:bg-slate-800 shrink-0"
    />
  );
}

export default function EditorToolbar({ editor, pendingFilesRef }) {
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState("faces");
  const pickerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const forceRerender = () => setTick((t) => t + 1);
    editor.on("transaction", forceRerender);
    return () => editor.off("transaction", forceRerender);
  }, [editor]);

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

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, and WebP files are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      event.target.value = "";
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    if (pendingFilesRef?.current) {
      pendingFilesRef.current.set(blobUrl, file);
    }

    editor
      .chain()
      .focus()
      .setImage({ src: blobUrl, mediaId: null })
      .createParagraphNear()
      .focus()
      .run();

    event.target.value = "";
  }

  return (
    <div className="flex flex-row items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 w-full sm:w-auto overflow-x-auto scrollbar-none snap-x touch-pan-x">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive("paragraph") && !editor.isActive("fontSize")}
          title="Normal Text"
        >
          <Type size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <Underline size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          title="Highlight"
        >
          <Highlighter size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered size={15} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Insert Image or GIF"
        >
          <ImageIcon size={15} />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="relative shrink-0" ref={pickerRef}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`px-3 h-9 sm:h-8 flex items-center gap-1.5 rounded-xl text-xs font-semibold transition-all border ${
            showEmojiPicker
              ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/15"
              : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <span>🥰</span>
          <span className="hidden sm:inline">Emojis</span>
        </button>

        {showEmojiPicker && (
          <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mb-0 sm:mt-2 z-50 w-72 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl flex flex-col gap-2 text-slate-900 dark:text-white animate-in fade-in slide-in-from-bottom-2 sm:slide-in-from-top-2 duration-150">
            <div className="flex gap-1 border-b border-slate-100 dark:border-slate-900 pb-1.5 overflow-x-auto scrollbar-none">
              {EMOJI_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleTabClick(cat.id)}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-violet-600 text-white"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1 scroll-smooth"
              style={{ scrollbarWidth: "thin" }}
            >
              {EMOJI_CATEGORIES.map((category) => {
                const emojisInSection = CUSTOM_EMOJIS.filter(
                  (e) => e.category === category.id
                );
                return (
                  <div key={category.id} id={`emoji-section-${category.id}`}>
                    <div className="text-[9px] uppercase tracking-wider font-extrabold text-violet-600 dark:text-violet-400 mb-1 bg-white dark:bg-slate-950 py-0.5 sticky top-0">
                      {category.label}
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {emojisInSection.map((emoji) => (
                        <button
                          key={emoji.name}
                          type="button"
                          onClick={() => handleSelectEmoji(emoji)}
                          className="p-1 rounded-lg bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 active:scale-90 transition-all flex items-center justify-center"
                          title={emoji.name}
                        >
                          <img
                            src={emoji.url}
                            alt={emoji.name}
                            className="w-7 h-7 object-contain pointer-events-none"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
