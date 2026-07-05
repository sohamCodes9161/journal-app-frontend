// src/features/journal/components/editor/JournalEditor.jsx
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import TiptapCharacterCount from "@tiptap/extension-character-count";
import Dropcursor from "@tiptap/extension-dropcursor"; // NEW: Premium visual drag placement line
import { Mark } from "@tiptap/core";
import { toast } from "react-hot-toast";

import EditorToolbar from "./EditorToolbar";
import { InlineEmoji } from "./extensions/InlineEmoji";
import { ExtendedImage } from "../../utils/ExtendedImage";
import { getThemeConfig } from "../../utils/journalThemes";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

// Built-in compression engine to clean files incoming via drag/paste
const compressImageFile = (file, maxWidth = 1400, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    if (file.type === "image/gif") return resolve(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob)
              return reject(new Error("Canvas blob conversion failed"));
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

const FontSize = Mark.create({
  name: "fontSize",
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) =>
          attributes.size ? { style: `font-size: ${attributes.size}` } : {},
      },
    };
  },
  parseHTML() {
    return [{ tag: "span[style*='font-size']" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
});

const JournalEditor = forwardRef(
  (
    {
      initialContent,
      editable = true,
      onChange,
      onUpdate, // NEW: Accepts the visual sync status update context trigger
      themePreset = "warm-parchment",
      pendingFilesRef,
    },
    ref
  ) => {
    const activeTheme = getThemeConfig(themePreset);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({ history: true }),
        Placeholder.configure({
          placeholder: "Start letting your thoughts flow here...",
        }),
        Underline,
        Highlight,
        TiptapCharacterCount,
        FontSize,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        ExtendedImage,
        InlineEmoji,
        Dropcursor.configure({
          color: "#8b5cf6", // Beautiful violet dropcursor guide color
          width: 2,
        }),
      ],
      content: initialContent,
      editable,
      editorProps: {
        attributes: {
          class:
            "w-full min-w-full block min-h-[250px] py-1 outline-none prose max-w-none focus:ring-0 focus:outline-none text-base text-current",
        },

        // NEW: Feature 2 - Direct Desktop Image Drag & Drop Interceptor
        handleDrop(view, event, slice, moved) {
          if (!moved && event.dataTransfer?.files?.length > 0) {
            const file = event.dataTransfer.files[0];
            if (ALLOWED_TYPES.includes(file.type)) {
              event.preventDefault();
              insertAndProcessMedia(file);
              return true; // Successfully intercepted drop handler
            }
          }
          return false;
        },

        // NEW: Feature 2 - Direct Clipboard Paste Image Interceptor (Ctrl+V)
        handlePaste(view, event, slice) {
          if (event.clipboardData?.files?.length > 0) {
            const file = event.clipboardData.files[0];
            if (ALLOWED_TYPES.includes(file.type)) {
              event.preventDefault();
              insertAndProcessMedia(file);
              return true; // Successfully intercepted paste handler
            }
          }
          return false;
        },
      },
    });

    useImperativeHandle(ref, () => editor, [editor]);

    // NEW: Central processing loop for Dragged or Pasted files inside the canvas boundary
    const insertAndProcessMedia = async (file) => {
      let processedFile = file;

      if (file.type !== "image/gif") {
        const compressToastId = toast.loading(
          "Compressing asset for optimal performance..."
        );
        try {
          processedFile = await compressImageFile(file);
          toast.dismiss(compressToastId);
        } catch (err) {
          toast.dismiss(compressToastId);
          console.error(
            "Drop compression bypassed; falling back to original source file:",
            err
          );
        }
      }

      if (processedFile.size > MAX_FILE_SIZE_BYTES) {
        return toast.error("File is too large. Maximum size allowed is 10MB.");
      }

      const blobUrl = URL.createObjectURL(processedFile);
      if (pendingFilesRef?.current) {
        pendingFilesRef.current.set(blobUrl, processedFile);
      }

      // Drop file node exactly where the cursor focuses
      editor
        .chain()
        .focus()
        .setImage({ src: blobUrl, mediaId: null })
        .createParagraphNear()
        .focus()
        .run();
    };

    // NEW: Listens for user mutations to propagate changes up to the sync status indicator
    useEffect(() => {
      if (!editor) return;

      const handleUpdate = () => {
        if (onUpdate) onUpdate();
        if (onChange) onChange(editor.getJSON());
      };

      editor.on("update", handleUpdate);
      return () => {
        editor.off("update", handleUpdate);
      };
    }, [editor, onUpdate, onChange]);

    useEffect(() => {
      if (!editor || !initialContent) return;
      if (JSON.stringify(editor.getJSON()) !== JSON.stringify(initialContent)) {
        editor.commands.setContent(initialContent, false);
      }
    }, [editor, initialContent]);

    useEffect(() => {
      if (editor) editor.setEditable(editable);
    }, [editor, editable]);

    if (!editor) return null;

    return (
      <div
        className="
w-full
flex-1
min-h-0
flex
flex-col
relative
"
      >
        {/* Desktop Inline Formatting Bar */}
        {editable && (
          <div className="hidden sm:block w-full pb-4">
            <EditorToolbar
              editor={editor}
              pendingFilesRef={pendingFilesRef}
              theme={activeTheme}
            />
          </div>
        )}

        {/* Streamlined Contextual Bubble Menu */}
        {editable && editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 150, placement: "top", offset: [0, 8] }}
            shouldShow={({ editor }) => editor.isActive("image")}
          >
            <div
              className={`flex items-center p-1 rounded-xl border shadow-xl backdrop-blur-md transition-colors duration-500 text-xs font-medium ${
                activeTheme.uiClass ||
                "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <button
                type="button"
                onClick={() => editor.commands.deleteSelection()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors font-semibold text-xs"
                title="Remove Image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span>Remove Image</span>
              </button>
            </div>
          </BubbleMenu>
        )}

        {/* Text Area Content Focus Container */}
        <div
          className="
flex-1
min-h-0
overflow-y-auto
cursor-text
pb-24
"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              editor.commands.focus("end");
            }
          }}
        >
          <EditorContent editor={editor} className="h-full" />
        </div>

        {/* Mobile Formatting Bottom Float Strip */}
        {/* Mobile Toolbar */}
        {editable && (
          <div
            className={`
      sm:hidden
      shrink-0
      border-t
      p-3
      pb-safe
      backdrop-blur-md
      transition-colors
      duration-500
      shadow-xl
      ${activeTheme.bgClass}
      ${activeTheme.borderClass}
    `}
          >
            <EditorToolbar
              editor={editor}
              pendingFilesRef={pendingFilesRef}
              theme={activeTheme}
            />
          </div>
        )}
      </div>
    );
  }
);

JournalEditor.displayName = "JournalEditor";
export default JournalEditor;
