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
        renderHTML: (attributes) =>
          attributes.size ? { style: `font-size: ${attributes.size}` } : {},
      },
    };
  },
  parseHTML() {
    return [{ tag: "span[style*='font-size']" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
});

const JournalEditor = forwardRef(
  (
    {
      initialContent,
      editable = true,
      onChange,
      themePreset = "warm-parchment",
      pendingFilesRef,
    },
    ref
  ) => {
    const activeTheme = getThemeConfig(themePreset);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({ history: true }),
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
      editorProps: {
        attributes: {
          class:
            "w-full min-w-full block min-h-[250px] py-1 outline-none prose max-w-none focus:ring-0 focus:outline-none text-base text-current",
        },
      },
    });

    useImperativeHandle(ref, () => editor, [editor]);

    useEffect(() => {
      if (!editor || !initialContent) return;
      if (JSON.stringify(editor.getJSON()) !== JSON.stringify(initialContent)) {
        editor.commands.setContent(initialContent, false);
      }
    }, [editor, initialContent]);

    useEffect(() => {
      if (editor) editor.setEditable(editable);
    }, [editor, editable]);

    if (!editor) return null;

    return (
      <div className="w-full relative flex-1 flex flex-col">
        {/* Desktop Inline Formatting Bar */}
        {editable && (
          <div className="hidden sm:block w-full pb-4">
            <EditorToolbar
              editor={editor}
              pendingFilesRef={pendingFilesRef}
              theme={activeTheme}
            />
          </div>
        )}

        {/* 
          FIXED: Streamlined Contextual Bubble Menu.
          Only contains a clean, expressive trash action to purge the image element.
        */}
        {editable && editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 150, placement: "top", offset: [0, 8] }}
            shouldShow={({ editor }) => editor.isActive("image")}
          >
            <div
              className={`flex items-center p-1 rounded-xl border shadow-xl backdrop-blur-md transition-colors duration-500 text-xs font-medium ${
                activeTheme.uiClass ||
                "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <button
                type="button"
                onClick={() => editor.commands.deleteSelection()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors font-semibold text-xs"
                title="Remove Image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span>Remove Image</span>
              </button>
            </div>
          </BubbleMenu>
        )}

        {/* Text Area Content Focus Container */}
        <div
          className="w-full flex-1 min-h-[400px] cursor-text pb-20"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              editor.commands.focus("end");
            }
          }}
        >
          <EditorContent editor={editor} />
        </div>

        {/* Mobile Formatting Bottom Float Strip */}
        {editable && (
          <div
            className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 pb-safe border-t backdrop-blur-md transition-colors duration-500 shadow-xl ${activeTheme.bgClass} ${activeTheme.borderClass}`}
          >
            <div className="w-full">
              <EditorToolbar
                editor={editor}
                pendingFilesRef={pendingFilesRef}
                theme={activeTheme}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

JournalEditor.displayName = "JournalEditor";
export default JournalEditor;
