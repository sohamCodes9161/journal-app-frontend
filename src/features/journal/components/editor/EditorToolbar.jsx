// src/features/journal/components/editor/EditorToolbar.jsx
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

/* 
  FIXED: Added utility function to physically compress image files down using HTML5 canvas.
  This scales down excessive dimensions and optimizes quality to significantly lower file sizes.
*/
const compressImageFile = (file, maxWidth = 1400, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    // Skip canvas compression for animated GIFs to preserve frames
    if (file.type === "image/gif") {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Downscale matching target maximum dimension boundaries
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the rendered canvas frame back to a lightweight JPEG blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Canvas blob conversion failed"));
            }
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, "") + ".jpg",
              {
                type: "image/jpeg",
                lastModified: Date.now(),
              }
            );
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

function ToolbarButton({ onClick, isActive, title, children, theme }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`
        w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-all duration-200 shrink-0 snap-center
        ${
          isActive
            ? `${
                theme?.isDark
                  ? "bg-violet-500/20 text-violet-400"
                  : "bg-violet-100 text-violet-700"
              } font-bold shadow-sm scale-95`
            : theme?.uiBtnHover || "text-slate-600 hover:bg-slate-100"
        }
      `}
    >
      {children}
    </button>
  );
}

function ToolbarDivider({ theme }) {
  return (
    <div
      className={`hidden sm:block w-px h-4 self-center mx-1 select-none shrink-0 transition-colors duration-500 ${
        theme?.uiDivider || "bg-slate-200"
      }`}
    />
  );
}

export default function EditorToolbar({ editor, pendingFilesRef, theme }) {
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

  // FIXED: Integrated client-side canvas processing logic right inside the handler flow
  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, and WebP files are allowed.");
      event.target.value = "";
      return;
    }

    let processedFile = file;

    // Trigger physical binary compression for large, non-GIF images
    if (file.type !== "image/gif") {
      const compressToastId = toast.loading(
        "Compressing image for optimal cloud storage..."
      );
      try {
        processedFile = await compressImageFile(file);
        toast.dismiss(compressToastId);
      } catch (compressionError) {
        toast.dismiss(compressToastId);
        console.error(
          "Compression engine bypassed; falling back to original:",
          compressionError
        );
      }
    }

    // Guard check against the final optimized file capacity limit
    if (processedFile.size > MAX_FILE_SIZE_BYTES) {
      toast.error(
        `File is too large. Maximum size allowed is ${MAX_FILE_SIZE_MB}MB.`
      );
      event.target.value = "";
      return;
    }

    const blobUrl = URL.createObjectURL(processedFile);
    if (pendingFilesRef?.current) {
      pendingFilesRef.current.set(blobUrl, processedFile);
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
    <div className="flex flex-row items-center justify-start gap-2 w-full">
      <div
        className={`
          flex items-center gap-0.5 border rounded-xl p-0.5 sm:p-1
          w-auto max-w-full
          overflow-x-auto scrollbar-none snap-x touch-pan-x
          transition-colors duration-500
          ${theme?.uiClass || "bg-slate-50 border-slate-200 text-slate-700"}
        `}
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
          theme={theme}
        >
          <Undo className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
          theme={theme}
        >
          <Redo className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </ToolbarButton>

        <ToolbarDivider theme={theme} />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
          theme={theme}
        >
          <Heading1 className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
          theme={theme}
        >
          <Heading2 className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={
            editor.isActive("paragraph") && !editor.isActive("fontSize")
          }
          title="Normal Text"
          theme={theme}
        >
          <Type className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </ToolbarButton>

        <ToolbarDivider theme={theme} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
          theme={theme}
        >
          <Bold className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
          theme={theme}
        >
          <Italic className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
          theme={theme}
        >
          <Underline className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          title="Highlight"
          theme={theme}
        >
          <Highlighter className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </ToolbarButton>

        <ToolbarDivider theme={theme} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
          theme={theme}
        >
          <List className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
          theme={theme}
        >
          <ListOrdered className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </ToolbarButton>

        <ToolbarDivider theme={theme} />

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Insert Image or GIF"
          theme={theme}
        >
          <ImageIcon className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
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
          className={`
            w-7 h-7 sm:w-auto sm:px-3 sm:h-8 flex items-center justify-center sm:gap-1.5 rounded-xl text-xs font-semibold
            transition-all duration-300 border
            ${
              showEmojiPicker
                ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-600/15"
                : `${theme?.uiClass || "bg-slate-50 border-slate-200 text-slate-700"} ${
                    theme?.uiBtnHover || "hover:bg-slate-100"
                  }`
            }
          `}
        >
          <span>🥰</span>
          <span className="hidden sm:inline">Emojis</span>
        </button>

        {showEmojiPicker && (
          <div
            className={`
              absolute left-0 sm:left-auto sm:right-0 bottom-full sm:bottom-auto sm:top-full
              mb-2 sm:mb-0 sm:mt-2
              z-50 w-72 p-3 rounded-2xl border shadow-2xl
              flex flex-col gap-2
              animate-in fade-in slide-in-from-bottom-2 sm:slide-in-from-top-2 duration-150
              transition-colors duration-500
              ${theme?.uiClass || "bg-white border-slate-200 text-slate-900"}
            `}
          >
            <div
              className={`flex gap-1 border-b pb-1.5 overflow-x-auto scrollbar-none ${
                theme?.borderClass || "border-slate-100"
              }`}
            >
              {EMOJI_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleTabClick(cat.id)}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? theme?.uiBtnActive || "bg-violet-600 text-white"
                      : `${theme?.mutedClass || "text-slate-500"} ${
                          theme?.uiBtnHover || "hover:bg-slate-100"
                        }`
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
                    <div
                      className={`text-[9px] uppercase tracking-wider font-extrabold mb-1 py-0.5 ${
                        theme?.isDark ? "text-violet-400" : "text-violet-600"
                      }`}
                    >
                      {category.label}
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {emojisInSection.map((emoji) => (
                        <button
                          key={emoji.name}
                          type="button"
                          onClick={() => handleSelectEmoji(emoji)}
                          className={`
                            p-1 rounded-lg border active:scale-90 transition-all
                            flex items-center justify-center
                            ${
                              theme?.isDark
                                ? "bg-white/[0.01] border-white/5 hover:bg-white/10"
                                : `bg-white/50 border-black/5 hover:bg-white/80`
                            }
                          `}
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
}
