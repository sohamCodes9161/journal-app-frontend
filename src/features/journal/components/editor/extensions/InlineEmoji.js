import { Node, mergeAttributes } from "@tiptap/core";

export const InlineEmoji = Node.create({
  name: "inlineEmoji",
  group: "inline",
  inline: true, // 👈 Crucial: Keeps it inside the text stream!
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "emoji" },
    };
  },

  parseHTML() {
    return [{ tag: 'img[data-type="inline-emoji"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(HTMLAttributes, {
        "data-type": "inline-emoji",
        class: "animate-fade-in inline-block align-middle select-none",
        style:
          "width: 28px; height: 28px; margin: 0 4px; display: inline-block;",
      }),
    ];
  },

  addCommands() {
    return {
      insertEmoji:
        (attributes) =>
        ({ chain }) => {
          return chain()
            .insertContent({ type: this.name, attrs: attributes })
            .run();
        },
    };
  },
});
