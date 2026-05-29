import { forwardRef, useEffect, useImperativeHandle } from "react";

import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import Placeholder from "@tiptap/extension-placeholder";

import Underline from "@tiptap/extension-underline";

import Highlight from "@tiptap/extension-highlight";

import TextAlign from "@tiptap/extension-text-align";

import CharacterCount from "@tiptap/extension-character-count";

import Image from "@tiptap/extension-image";

import EditorToolbar from "./EditorToolbar";

import { InlineEmoji } from "./extensions/InlineEmoji";

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

        // Remove the standalone `Image,` from the extensions array and replace it with this:
        Image.extend({
          addAttributes() {
            return {
              ...this.parent?.(),
              mediaId: {
                default: null,
              },
            };
          },
        }),
        InlineEmoji,
      ],

      content: initialContent,

      editable,

      autofocus: false,

      // 🔴 FIXED: Emits changes back up to the parent component state
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

    // expose editor safely
    useImperativeHandle(ref, () => editor, [editor]);

    // react properly to editable mode changes
    useEffect(() => {
      if (!editor) return;

      editor.setEditable(editable);
    }, [editor, editable]);

    // update content only when journal changes
    useEffect(() => {
      if (!editor || !initialContent) return;

      const currentContent = editor.getJSON();

      const isSameContent =
        JSON.stringify(currentContent) === JSON.stringify(initialContent);

      if (isSameContent) return;

      editor.commands.setContent(initialContent);
    }, [editor, initialContent]); // 🔴 FIXED: Added initialContent dependency to handle resets/cancels properly

    if (!editor) return null;

    return (
      <div className="space-y-5">
        {editable && <EditorToolbar editor={editor} />}

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
