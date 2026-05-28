export const extractTextFromContent = (content) => {
  if (!content?.content) return "";

  const texts = [];

  const traverse = (nodes) => {
    nodes.forEach((node) => {
      if (node.type === "text" && node.text) {
        texts.push(node.text);
      }

      if (node.content) {
        traverse(node.content);
      }
    });
  };

  traverse(content.content);

  return texts.join(" ").trim();
};
