// src/features/journal/utils/ExtendedImage.js
import Image from "@tiptap/extension-image";

export const ExtendedImage = Image.extend({
  inline: false,
  group: "block",

  addAttributes() {
    return {
      ...this.parent?.(),
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      {
        ...HTMLAttributes,
        /* 
          FIXED: Dropped max-width to 220px so it stays neatly small.
          Changed margin to '16px auto 16px 0' to anchor it perfectly to the left corner.
        */
        style:
          "width: 100% !important; max-width: 220px !important; height: auto !important; display: block !important; margin: 16px auto 16px 0 !important; transition: all 0.2s ease-in-out;",
        class:
          "rounded-2xl border border-black/5 dark:border-white/5 shadow-md cursor-pointer",
      },
    ];
  },
});
