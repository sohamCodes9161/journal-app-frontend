// src/components/editor/extensions/ExtendedImage.js
import Image from "@tiptap/extension-image";

export const ExtendedImage = Image.extend({
  // 1. Register custom settings for width and alignment
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      mediaId: { default: null },
      width: { default: "100%" }, // Controls scaling size
      alignment: { default: "center" }, // left, center, right
    };
  },

  // 2. Transform those settings into elegant Tailwind wrap classes dynamically
  renderHTML({ HTMLAttributes }) {
    const alignment = HTMLAttributes.alignment || "center";
    const width = HTMLAttributes.width || "100%";

    let layoutClasses =
      "rounded-2xl max-w-full border border-white/5 transition-all duration-300 ";

    if (alignment === "left") {
      layoutClasses += "float-left mr-4 mb-4 clear-left";
    } else if (alignment === "right") {
      layoutClasses += "float-right ml-4 mb-4 clear-right";
    } else {
      layoutClasses += "block mx-auto my-6";
    }

    return [
      "img",
      {
        ...HTMLAttributes,
        class: layoutClasses,
        style: `width: ${width}; display: ${alignment === "center" ? "block" : "inline-block"};`,
      },
    ];
  },
});
