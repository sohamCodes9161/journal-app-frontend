import { forwardRef, useEffect, useImperativeHandle } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import TiptapCharacterCount from "@tiptap/extension-character-count"; // ✅ Fixed: Points to correct package now
import { Mark } from "@tiptap/core";
import EditorToolbar from "./EditorToolbar";
import { InlineEmoji } from "./extensions/InlineEmoji";
import { ExtendedImage } from "../../utils/ExtendedImage";
import { useTodos } from "@/features/todos/hooks/useTodos";
// ─── Reflection Panel Companion ─────────────────────────────────────────────
import { useState } from "react";

function JournalReflectionHelper({ onInsertMention }) {
  const { data: separatedTodos, isLoading } = useTodos();
  const fulfilledItems = separatedTodos?.completedToday || [];

  // 1. Local states to manage user control and item evaporation
  const [isOpen, setIsOpen] = useState(false);
  const [usedTodoIds, setUsedTodoIds] = useState(new Set());

  // Filter out any intentions the user has already clicked and talked about
  const visibleItems = fulfilledItems.filter(
    (item) => !usedTodoIds.has(item._id)
  );

  // If loading, or there's nothing done today, or they used everything -> absolute zero footprint
  if (isLoading || visibleItems.length === 0) return null;

  return (
    <div className="w-full transition-all duration-500 ease-in-out">
      {/* Dynamic Trigger Toggle Badge */}
      {!isOpen ? (
        <div className="flex justify-start px-1">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-violet-300 bg-white/[0.02] border border-white/5 hover:border-violet-500/20 px-3 py-1.5 rounded-xl transition-all duration-300 shadow-sm"
          >
            <span className="inline-block animate-pulse text-violet-400 group-hover:scale-110 transition-transform">
              ✨
            </span>
            Reflect on today's achievements?
            <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded-md text-slate-500 group-hover:text-violet-200 transition-colors">
              {visibleItems.length} available
            </span>
          </button>
        </div>
      ) : (
        /* The Expanded Focused Drawer */
        <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-4 backdrop-blur-md space-y-3 animate-fade-in relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🧠</span>
              <h4 className="text-xs font-semibold tracking-wider uppercase text-violet-400/90">
                Focal Points to Anchor Your Reflection
              </h4>
            </div>

            {/* Smooth collapse toggle button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[10px] uppercase font-bold text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md transition-all"
            >
              Hide Canvas Clutter ✕
            </button>
          </div>

          <p className="text-xs text-slate-400/80 leading-relaxed max-w-2xl">
            Clicking an intention drops it cleanly into your sentence stream.
            Once mentioned, it will fade away to guard your focus.
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1 max-h-32 overflow-y-auto">
            {visibleItems.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => {
                  // Fire Tiptap macro insertion
                  onInsertMention?.(item.title);
                  // Trigger evaporation sequence logic
                  setUsedTodoIds((prev) => new Set([...prev, item._id]));
                }}
                className="text-xs px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.02] text-slate-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-200 transition-all duration-300 transform active:scale-95 text-left max-w-xs truncate"
              >
                ✦ {item.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FontSize mark extension ─────────────────────────────────────────────────
const FontSize = Mark.create({
  name: "fontSize",

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.size) return {};
          return { style: `font-size: ${attributes.size}` };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[style*='font-size']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },

  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) =>
          chain().setMark(this.name, { size }).run(),

      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().unsetMark(this.name).run(),
    };
  },
});

// ─── JournalEditor ────────────────────────────────────────────────────────────
const JournalEditor = forwardRef(
  ({ initialContent, editable = true, onChange, pendingFilesRef }, ref) => {
    const editor = useEditor({
      immediatelyRender: false,

      extensions: [
        StarterKit.configure({
          history: true,
          bulletList: { keepMarks: true, keepAttributes: true },
          orderedList: { keepMarks: true, keepAttributes: true },
          heading: { levels: [1, 2, 3] },
        }),
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
      ],

      content: initialContent,
      editable,
      autofocus: false,

      onUpdate: ({ editor }) => {
        if (onChange) onChange(editor.getJSON());
      },

      editorProps: {
        attributes: {
          class:
            "w-full min-w-full block min-h-[350px] rounded-2xl border border-white/5 bg-white/[0.01] px-5 py-4 text-slate-200 outline-none transition-all duration-200 focus:border-violet-500/20 prose prose-invert max-w-none overflow-y-auto text-sm",
        },
      },
    });

    // Frictionless injection command loop to insert the item cleanly right at cursor position
    const handleInsertMention = (title) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertContent(`<strong>[Reflected Intention: ${title}]</strong> `)
        .run();
    };

    // Sync content when initialContent changes (e.g. journal loads from API)
    useEffect(() => {
      if (!editor || !initialContent) return;

      const currentContentStr = JSON.stringify(editor.getJSON());
      const incomingContentStr =
        typeof initialContent === "string"
          ? initialContent
          : JSON.stringify(initialContent);

      if (currentContentStr !== incomingContentStr) {
        editor.commands.setContent(initialContent, false);
      }
    }, [editor, initialContent]);

    // Expose the editor instance to the parent via ref
    useImperativeHandle(ref, () => editor, [editor]);

    // Sync editable flag
    useEffect(() => {
      if (!editor) return;
      editor.setEditable(editable);
    }, [editor, editable]);

    if (!editor) return null;

    return (
      <div className="space-y-4 w-full max-w-4xl mx-auto block">
        {/* Toolbar */}
        {editable && (
          <EditorToolbar editor={editor} pendingFilesRef={pendingFilesRef} />
        )}

        {/* NEW ENHANCEMENT: The Reflection Bridge rendered beautifully right here */}
        {editable && (
          <JournalReflectionHelper onInsertMention={handleInsertMention} />
        )}

        {/* BubbleMenu for image alignment + size controls */}
        {editable && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 150 }}
            shouldShow={({ editor }) => editor.isActive("image")}
          >
            <div className="flex items-center gap-1 bg-slate-900/95 border border-white/10 p-1.5 rounded-xl shadow-2xl backdrop-blur-md text-white">
              <button
                type="button"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .updateAttributes("image", { alignment: "left" })
                    .run()
                }
                className="px-2 py-1 text-xs font-medium rounded-md text-slate-300 hover:bg-white/10 transition-colors"
              >
                Left
              </button>
              <button
                type="button"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .updateAttributes("image", { alignment: "center" })
                    .run()
                }
                className="px-2 py-1 text-xs font-medium rounded-md text-slate-300 hover:bg-white/10 transition-colors"
              >
                Center
              </button>
              <button
                type="button"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .updateAttributes("image", { alignment: "right" })
                    .run()
                }
                className="px-2 py-1 text-xs font-medium rounded-md text-slate-300 hover:bg-white/10 transition-colors"
              >
                Right
              </button>

              <div className="w-px h-3.5 bg-white/10 mx-1" />

              <button
                type="button"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .updateAttributes("image", { size: "small" })
                    .run()
                }
                className="w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-md text-slate-400 hover:bg-white/10 hover:text-white"
              >
                S
              </button>
              <button
                type="button"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .updateAttributes("image", { size: "medium" })
                    .run()
                }
                className="w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-md text-slate-400 hover:bg-white/10 hover:text-white"
              >
                M
              </button>
              <button
                type="button"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .updateAttributes("image", { size: "large" })
                    .run()
                }
                className="w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-md text-slate-400 hover:bg-white/10 hover:text-white"
              >
                L
              </button>

              <div className="w-px h-3.5 bg-white/10 mx-1" />

              <button
                type="button"
                onClick={() => editor.chain().focus().deleteSelection().run()}
                className="px-2 py-1 text-xs font-medium rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                title="Remove image"
              >
                Delete
              </button>
            </div>
          </BubbleMenu>
        )}

        {/* Text Area Canvas Wrapper */}
        <div className="w-full block rounded-2xl border border-white/10 bg-slate-950/10 backdrop-blur-xl p-1">
          <EditorContent editor={editor} className="w-full block" />
        </div>

        {/* Footer info tracking panel */}
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 select-none">
          <p>{editable ? "Personal Sanctuary Open" : "Archived Thought"}</p>
          <p>{editor.storage.characterCount.characters()} characters</p>
        </div>
      </div>
    );
  }
);

JournalEditor.displayName = "JournalEditor";
export default JournalEditor;
