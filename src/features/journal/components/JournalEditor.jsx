import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

function JournalEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],

    content,

    editorProps: {
      attributes: {
        class: `
          min-h-[350px]
          rounded-3xl
          border
          border-white/10
          bg-white/5
          px-6
          py-5
          text-slate-200
          outline-none
          prose
          prose-invert
          max-w-none
          focus:outline-none
        `,
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
