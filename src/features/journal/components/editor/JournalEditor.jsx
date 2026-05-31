import { forwardRef, useEffect, useImperativeHandle } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import EditorToolbar from "./EditorToolbar";
import { InlineEmoji } from "./extensions/InlineEmoji";
import { ExtendedImage } from "../../utils/ExtendedImage";

const JournalEditor = forwardRef(
  ({ initialContent, editable = true, onChange }, ref) => {
    const editor = useEditor({
      immediatelyRender: false,

      extensions: [
        StarterKit.configure({
          history: true,
          bulletList: {
            keepMarks: true,
            keepAttributes: true,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: true,
          },
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Placeholder.configure({
          placeholder: "Write freely. No pressure. Just thoughts...",
        }),
        Underline,
        Highlight,
        CharacterCount,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        ExtendedImage,
        InlineEmoji,
      ],

      content: initialContent,
      editable,
      autofocus: false,

      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange(editor.getJSON());
        }
      },

      editorProps: {
        attributes: {
          class:
            "min-h-[400px] rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-slate-200 outline-none transition-all duration-200 focus:border-violet-400 prose prose-invert prose-p:text-slate-200 prose-headings:text-white prose-strong:text-white prose-li:text-slate-200 prose-code:text-violet-300 prose-blockquote:border-violet-500 max-w-none overflow-y-auto",
        },
      },
    });

    // Expose editor safely
    useImperativeHandle(ref, () => editor, [editor]);

    // React properly to editable mode changes
    useEffect(() => {
      if (!editor) return;
      editor.setEditable(editable);
    }, [editor, editable]);

    // Update content only when journal changes
    useEffect(() => {
      if (!editor || !initialContent) return;

      const currentContent = editor.getJSON();
      const isSameContent =
        JSON.stringify(currentContent) === JSON.stringify(initialContent);

      if (isSameContent) return;

      editor.commands.setContent(initialContent);
    }, [editor, initialContent]);

    if (!editor) return null;

    // Helper function to update the chosen attribute on the selected image
    const updateImageLayout = (attrs) => {
      editor.chain().focus().updateAttributes("image", attrs).run();
    };

    return (
      <div className="space-y-5 relative">
        {editable && <EditorToolbar editor={editor} />}

        {/* ✨ NEXT-GEN FLOATING IMAGE BUBBLE POPUP */}
        {editable && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 150, placement: "top" }}
            shouldShow={({ editor }) => editor.isActive("image")}
          >
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 border border-violet-500/40 p-2 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-100 z-50 text-white">
              <span className="text-[10px] font-bold tracking-wider uppercase text-violet-400 px-1 select-none">
                Image:
              </span>

              {/* Alignment Snapping */}
              <button
                type="button"
                onClick={() => updateImageLayout({ alignment: "left" })}
                className="px-2 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 text-slate-200 transition font-medium"
              >
                ⬅️ Left Wrap
              </button>
              <button
                type="button"
                onClick={() => updateImageLayout({ alignment: "center" })}
                className="px-2 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 text-slate-200 transition font-medium"
              >
                ⏹️ Center
              </button>
              <button
                type="button"
                onClick={() => updateImageLayout({ alignment: "right" })}
                className="px-2 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 text-slate-200 transition font-medium"
              >
                ➡️ Right Wrap
              </button>

              <div className="w-px h-4 bg-white/10 mx-0.5" />

              {/* Sizing Scalers */}
              <button
                type="button"
                onClick={() => updateImageLayout({ width: "25%" })}
                className="px-2 py-1 text-[11px] rounded-md bg-white/5 hover:bg-white/10 text-slate-300 transition"
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => updateImageLayout({ width: "50%" })}
                className="px-2 py-1 text-[11px] rounded-md bg-white/5 hover:bg-white/10 text-slate-300 transition"
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => updateImageLayout({ width: "100%" })}
                className="px-2 py-1 text-[11px] rounded-md bg-white/5 hover:bg-white/10 text-slate-300 transition"
              >
                100%
              </button>

              <div className="w-px h-4 bg-white/10 mx-0.5" />

              {/* Safe Escape Hatch */}
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().createParagraphNear().focus().run()
                }
                className="px-2.5 py-1 text-[11px] rounded-md bg-violet-600 hover:bg-violet-500 font-bold text-white transition active:scale-95 flex items-center gap-1"
                title="Create an empty row below this image to type into"
              >
                ⏎ Line Below
              </button>
            </div>
          </BubbleMenu>
        )}

        <div
          className="
            rounded-[28px]
            border
            border-white/10
            bg-gradient-to-b
            from-white/[0.04]
            to-white/[0.02]
            p-2
            backdrop-blur-xl
          "
        >
          <EditorContent editor={editor} />
        </div>

        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-slate-500">
            {editable ? "Editing mode enabled" : "Reading mode enabled"}
          </p>

          <p className="text-xs text-slate-500">
            {editor.storage.characterCount.characters()} characters
          </p>
        </div>
      </div>
    );
  }
);

JournalEditor.displayName = "JournalEditor";
export default JournalEditor;
