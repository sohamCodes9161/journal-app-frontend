// src/features/journal/utils/ExtendedImage.js
import Image from "@tiptap/extension-image";

export const ExtendedImage = Image.extend({
  inline: true,
  group: "inline",

  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: "medium",
        parseHTML: (element) => element.getAttribute("data-size") || "medium",
        renderHTML: (attributes) => ({ "data-size": attributes.size }),
      },
      alignment: {
        default: "center",
        parseHTML: (element) =>
          element.getAttribute("data-alignment") || "center",
        renderHTML: (attributes) => ({
          "data-alignment": attributes.alignment,
        }),
      },
    };
  },

  // 🌟 FIXED: Destructured 'node' to pull directly from live mutable attributes (node.attrs)
  renderHTML({ node, HTMLAttributes }) {
    const size = node.attrs.size || "medium";
    const alignment = node.attrs.alignment || "center";

    // Dynamic Width Calculations
    let width = "50%";
    if (size === "small") width = "25%";
    if (size === "large") width = "100%";

    // Flow & Layout Calculations
    let display = "inline-block";
    let float = "none";
    let margin = "4px 8px";

    if (alignment === "left") {
      float = "left";
      display = "inline-block";
      margin = "8px 16px 8px 0";
    } else if (alignment === "right") {
      float = "right";
      display = "inline-block";
      margin = "8px 0 8px 16px";
    } else if (alignment === "center") {
      float = "none";
      display = "block";
      margin = "16px auto";
    }

    return [
      "img",
      {
        ...HTMLAttributes,
        // 🌟 FIXED: Added !important to completely override Tailwind Prose block style injections
        style: `width: ${width} !important; max-width: 100% !important; height: auto !important; display: ${display} !important; float: ${float} !important; margin: ${margin} !important; transition: all 0.2s ease-in-out;`,
        class: "rounded-xl border border-white/5 shadow-lg cursor-pointer",
      },
    ];
  },
});
