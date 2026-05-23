function extractTextFromContent(content) {
  if (!content?.content) {
    return "";
  }

  let text = "";

  function traverse(nodes) {
    nodes.forEach((node) => {
      if (node.type === "text") {
        text += `${node.text} `;
      }

      if (node.content) {
        traverse(node.content);
      }
    });
  }

  traverse(content.content);

  return text.trim();
}

export default extractTextFromContent;
