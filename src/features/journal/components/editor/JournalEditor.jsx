import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import Placeholder from "@tiptap/extension-placeholder";

import Underline from "@tiptap/extension-underline";

import Highlight from "@tiptap/extension-highlight";

import TextAlign from "@tiptap/extension-text-align";

import CharacterCount from "@tiptap/extension-character-count";

import EditorToolbar from "./EditorToolbar";

function JournalEditor({ content, onChange, editable = true }) {
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
    ],

    content,

    editable,

    autofocus: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[400px] rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-slate-200 outline-none transition-all duration-200 focus:border-violet-400 prose prose-invert prose-p:text-slate-200 prose-headings:text-white prose-strong:text-white prose-li:text-slate-200 prose-code:text-violet-300 prose-blockquote:border-violet-500 max-w-none overflow-y-auto",
      },
    },

    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-4">
      {editable && <EditorToolbar editor={editor} />}

      <EditorContent editor={editor} />

      <div className="text-right text-xs text-slate-500">
        {editor.storage.characterCount.characters()} characters
        console.log(await mutateAsync(file));
      </div>
    </div>
  );
}

export default JournalEditor;
