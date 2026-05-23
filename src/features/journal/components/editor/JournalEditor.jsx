import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

function JournalEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,

      Placeholder.configure({
        placeholder: "Write freely. No pressure. Just thoughts...",
      }),
    ],

    content,

    editorProps: {
      attributes: {
        class:
          "min-h-[350px] rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-slate-200 outline-none prose prose-invert max-w-none focus:outline-none focus-within:border-violet-400 transition",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}

export default JournalEditor;
