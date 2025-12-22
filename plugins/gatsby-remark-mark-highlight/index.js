const visit = require("unist-util-visit");

module.exports = ({ markdownAST }) => {
  visit(markdownAST, "text", (node, index, parent) => {
    const value = node.value;
    const regex = /==([^=]+)==/g;
    
    if (!regex.test(value)) {
      return;
    }
    
    // Reset regex
    regex.lastIndex = 0;
    
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(value)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          value: value.slice(lastIndex, match.index),
        });
      }
      
      // Add the highlighted text as HTML
      parts.push({
        type: "html",
        value: `<mark>${match[1]}</mark>`,
      });
      
      lastIndex = regex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < value.length) {
      parts.push({
        type: "text",
        value: value.slice(lastIndex),
      });
    }
    
    if (parts.length > 0) {
      parent.children.splice(index, 1, ...parts);
    }
  });
  
  return markdownAST;
};

