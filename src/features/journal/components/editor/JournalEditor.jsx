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
import { Mark } from "@tiptap/core";

import EditorToolbar from "./EditorToolbar";
import ThemeSelector from "./ThemeSelector";
import JournalReflectionHelper from "./JournalReflectionHelper";

import { InlineEmoji } from "./extensions/InlineEmoji";
import { ExtendedImage } from "../../utils/ExtendedImage";
import { getThemeConfig } from "../../utils/journalThemes";

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

const JournalEditor = forwardRef(
  (
    {
      initialContent,
      editable = true,
      onChange,
      onThemeChange,
      themePreset = "warm-parchment",
      pendingFilesRef,
    },
    ref
  ) => {
    const activeTheme = getThemeConfig(themePreset);

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
          class: `w-full min-w-full block min-h-[450px] py-2 outline-none transition-colors duration-500 prose max-w-none overflow-y-auto text-base text-current focus:ring-0`,
        },
      },
    });

    useImperativeHandle(ref, () => editor, [editor]);

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

    useEffect(() => {
      if (!editor) return;
      editor.setEditable(editable);
    }, [editor, editable]);

    if (!editor) return null;

    return (
      <div className="space-y-4 w-full block">
        {/* Top Atmosphere Settings Bar */}
        <div
          className={`flex items-center justify-between gap-4 border-b pb-2 transition-colors duration-500 ${activeTheme.borderClass}`}
        >
          {editable && (
            <ThemeSelector
              currentThemeId={themePreset}
              onThemeChange={onThemeChange}
              theme={activeTheme}
            />
          )}
          <div
            className={`text-[11px] font-mono tracking-tight transition-colors duration-500 ${activeTheme.mutedClass}`}
          >
            {editor.storage.characterCount.characters()} chars
          </div>
        </div>

        {/* 
          FIXED: Placed the formatting toolbar in a touch-responsive swipe container 
          so it scrolls cleanly horizontally instead of clipping on mobile layouts.
        */}
        {editable && (
          <div className="w-full overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="min-w-max">
              <EditorToolbar
                editor={editor}
                pendingFilesRef={pendingFilesRef}
                theme={activeTheme}
              />
            </div>
          </div>
        )}

        {/* Helper Panel */}
        {editable && (
          <JournalReflectionHelper
            onInsertMention={(title) => {
              editor
                .chain()
                .focus()
                .insertContent(
                  `<strong>[Reflected Intention: ${title}]</strong> `
                )
                .run();
            }}
            theme={activeTheme}
          />
        )}

        {/* Bubble Menu Overlay */}
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
            </div>
          </BubbleMenu>
        )}

        {/* 
          FIXED: Stripped away hard borders, rounding constraints, and local backgrounds. 
          The content area now blends naturally into the page background.
        */}
        <div className={`w-full block min-h-[450px] ${activeTheme.textClass}`}>
          <EditorContent editor={editor} className="w-full block" />
        </div>
      </div>
    );
  }
);

JournalEditor.displayName = "JournalEditor";
export default JournalEditor;
