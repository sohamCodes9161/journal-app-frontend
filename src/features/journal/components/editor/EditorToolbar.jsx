import { ImageIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useUploadImage } from "../../hooks/useUploadImage";
import { toast } from "react-hot-toast";
import { CUSTOM_EMOJIS, EMOJI_CATEGORIES } from "../../utils/customEmojis";

function ToolbarButton({ onClick, isActive, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`
        rounded-2xl
        px-3
        py-2
        text-sm
        transition-all
        duration-200
        ${
          isActive
            ? "bg-violet-500 text-white shadow-lg"
            : "bg-white/5 text-slate-300 hover:bg-white/10"
        }
      `}
    >
      {children}
    </button>
  );
}

function EditorToolbar({ editor }) {
  const fileInputRef = useRef(null);
  const { mutateAsync, isPending } = useUploadImage();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState("faces");
  const pickerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  if (!editor) return null;

  // Clean outside click logic for Emoji Picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Click category tab to smooth scroll inside list
  const handleTabClick = (categoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`emoji-section-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Tracks active emoji list header during continuous scroll scrolling
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

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await mutateAsync(file);
      console.log("UPLOAD RESPONSE:", response);

      const rawUrl = response?.url;
      const mediaId = response?.mediaId;

      const optimizedUrl =
        rawUrl && rawUrl.includes("cloudinary.com")
          ? rawUrl.replace("/upload/", "/upload/f_auto,q_auto,w_1200,c_limit/")
          : rawUrl;

      // Safe image drop layout chain sequence
      editor
        .chain()
        .focus()
        .setImage({
          src: optimizedUrl,
          mediaId,
        })
        .createParagraphNear() // Spawns writing lane right beneath image
        .focus() // Hands active cursor line straight down
        .run();

      toast.success("Image uploaded!");
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div
      className="
        sticky
        top-4
        z-10
        mb-4
        flex
        flex-wrap
        gap-2
        rounded-3xl
        border
        border-white/10
        bg-black/30
        p-3
        backdrop-blur-xl
      "
    >
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      >
        Bold
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      >
        Italic
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
      >
        Underline
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive("highlight")}
      >
        Highlight
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
      >
        Bullet List
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
      >
        Numbered List
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
      >
        H1
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
      >
        H2
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive("paragraph")}
      >
        Paragraph
      </ToolbarButton>

      <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
        Undo
      </ToolbarButton>

      <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
        Redo
      </ToolbarButton>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        className="
          rounded-2xl
          bg-white/5
          px-3
          py-2
          text-slate-300
          transition-all
          duration-200
          hover:bg-white/10
          disabled:opacity-50
        "
      >
        <ImageIcon size={18} />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* ✨ UNIFIED MULTI-SCROLL EMOJI PICKER */}
      <div className="relative" ref={pickerRef}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-lg text-lg transition duration-200 hover:bg-white/10 ${
            showEmojiPicker ? "bg-white/10 text-white" : "text-slate-400"
          }`}
          title="Insert Cute Emoji"
        >
          🥰
        </button>

        {showEmojiPicker && (
          <div className="absolute left-0 mt-2 z-50 w-76 p-3 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150 text-white">
            {/* Category Navigation Bar */}
            <div className="flex gap-1 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
              {EMOJI_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleTabClick(cat.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Continuous Infinite Grid Container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex flex-col gap-4 max-h-56 overflow-y-auto pr-1 scroll-smooth"
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
                    {/* Category Title Header */}
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2 sticky top-0 bg-slate-900/90 py-0.5 backdrop-blur-sm">
                      {category.label}
                    </div>

                    {/* Emojis Grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {emojisInSection.map((emoji) => (
                        <button
                          key={emoji.name}
                          type="button"
                          onClick={() => handleSelectEmoji(emoji)}
                          className="p-2 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/10 hover:border-white/20 active:scale-90 transition-all duration-150 flex items-center justify-center group"
                          title={emoji.name}
                        >
                          <img
                            src={emoji.url}
                            alt={emoji.name}
                            className="w-10 h-10 object-contain pointer-events-none group-hover:scale-115 transition-transform duration-200"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[10px] text-center text-slate-500 border-t border-white/5 pt-1.5 select-none">
              Scroll freely across lists • Click outside to close
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditorToolbar;
