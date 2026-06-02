import { forwardRef, useEffect, useImperativeHandle } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import { Mark } from "@tiptap/core";
import EditorToolbar from "./EditorToolbar";
import { InlineEmoji } from "./extensions/InlineEmoji";
import { ExtendedImage } from "../../utils/ExtendedImage";

// ─── FontSize mark extension (unchanged) ─────────────────────────────────────

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
//
// Props:
//   initialContent  : TipTap JSON object to seed the editor
//   editable        : boolean (default true)
//   onChange        : called with editor.getJSON() on every update
//   pendingFilesRef : React ref (useRef) holding a Map<blobUrl, File>
//                     Must be created in the parent page and passed down.
//                     The toolbar writes to it; the save handler reads from it.

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
        CharacterCount,
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
      <div className="space-y-3 w-full max-w-4xl mx-auto block">
        {/* Toolbar — receives pendingFilesRef so it can store picked files */}
        {editable && (
          <EditorToolbar editor={editor} pendingFilesRef={pendingFilesRef} />
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

              {/* Delete image button — removes node from editor */}
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

        <div className="w-full block rounded-2xl border border-white/10 bg-slate-950/10 backdrop-blur-xl p-1">
          <EditorContent editor={editor} className="w-full block" />
        </div>

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
