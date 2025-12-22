// 手动实现 visit 功能，避免 ESM/CJS 兼容性问题
function visit(tree, type, visitor) {
  function recurse(node, index, parent) {
    if (node.type === type) {
      visitor(node, index, parent);
    }
    if (node.children) {
      // 反向遍历，因为我们可能会修改数组
      for (let i = node.children.length - 1; i >= 0; i--) {
        recurse(node.children[i], i, node);
      }
    }
  }
  recurse(tree, null, null);
}

module.exports = ({ markdownAST }) => {
  visit(markdownAST, "text", (node, index, parent) => {
    if (!parent || index === null) return;
    
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
