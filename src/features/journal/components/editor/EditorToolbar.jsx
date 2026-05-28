import { ImageIcon } from "lucide-react";
import { useRef } from "react";

import { useUploadImage } from "../../hooks/useUploadImage";

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

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const response = await mutateAsync(file);

      console.log(response);

      // insert uploaded image into editor
      editor
        .chain()
        .focus()
        .setImage({
          src: response.imageUrl,
        })
        .run();
    } catch (error) {
      console.error(error);
    }
  }

  if (!editor) return null;

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
    </div>
  );
}

export default EditorToolbar;
