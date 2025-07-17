import { visit } from "unist-util-visit";

export default function remarkAside() {
  return (tree) => {
    visit(tree, "blockquote", (node, index, parent) => {
      if (!node.children || node.children.length === 0) return;

      const firstChild = node.children[0];
      if (
        firstChild.type !== "paragraph" ||
        !firstChild.children ||
        firstChild.children.length === 0
      )
        return;

      const firstText = firstChild.children[0];
      if (firstText.type !== "text") return;

      const calloutMatch = firstText.value.match(/^\[!(\w+)\](.*)$/s);
      if (!calloutMatch) return;

      const [, calloutType, remainingText] = calloutMatch;

      if (remainingText.trim()) {
        firstText.value = remainingText.replace(/^\s*\n?/, "");
      } else {
        firstChild.children.shift();
        if (firstChild.children.length === 0) {
          node.children.shift();
        }
      }

      node.data = node.data || {};
      node.data.hName = "aside";
      node.data.hProperties = {
        className: calloutType.toLowerCase(),
      };
    });
  };
}
