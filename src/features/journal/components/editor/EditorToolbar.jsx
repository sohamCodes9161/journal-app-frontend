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
        transition
        ${
          isActive
            ? "bg-violet-500 text-white"
            : "bg-white/5 text-slate-300 hover:bg-white/10"
        }
      `}
    >
      {children}
    </button>
  );
}

function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div
      className="
        mb-4
        flex
        flex-wrap
        gap-2
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-3
        backdrop-blur-sm
      "
    >
      <ToolbarButton
        onClick={() => {
          editor.commands.focus();

          editor.chain().toggleBold().run();
        }}
        isActive={editor.isActive("bold")}
      >
        Bold
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          editor.commands.focus();

          editor.chain().toggleItalic().run();
        }}
        isActive={editor.isActive("italic")}
      >
        Italic
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          editor.commands.focus();

          editor.chain().toggleBulletList().run();
        }}
        isActive={editor.isActive("bulletList")}
      >
        List
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          editor.commands.focus();

          editor
            .chain()
            .toggleHeading({
              level: 2,
            })
            .run();
        }}
        isActive={editor.isActive("heading", {
          level: 2,
        })}
      >
        Heading
      </ToolbarButton>
    </div>
  );
}

export default EditorToolbar;
