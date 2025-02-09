import { fromMarkdown } from "mdast-util-from-markdown";
import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";
import { common, createLowlight } from "lowlight";
import { visit } from "unist-util-visit";
import { toText } from "hast-util-to-text";
import { removePosition } from "unist-util-remove-position";
import dedent from "dedent";

// How rehype-highligt works !

// prettify <pre> putting new line right after opening tag
String.prototype.prettifyPre = function () {
  return this.replace(/<pre>(?!\n)/g, "<pre>\n");
};

const lowlight = createLowlight(common);

// input
const markdown_input = dedent`
\`\`\`javascript


"use strict";
      
console.log("xxx");


\`\`\`
`;

console.log(markdown_input);

// HAST
const mdastTree = fromMarkdown(markdown_input);
const hastTree = toHast(mdastTree);

removePosition(hastTree, { force: true });
console.dir(hastTree, { depth: null });

visit(hastTree, (node, index, parent) => {
  if (parent && typeof index === "number" && node.tagName === "code") {
    const text = toText(node, { whitespace: "pre" });
    console.log({ text });
    const highlighted = lowlight.highlight("javascript", text);
    console.dir(highlighted, { depth: null });
    node.children = structuredClone(highlighted.children);
    node.properties.className = ["hljs", `language-${highlighted.data.language}`];
  }
});

removePosition(hastTree, { force: true });
console.dir(hastTree, { depth: null });

// output
const markdown_output = String(toHtml(hastTree)).prettifyPre();

console.log(markdown_output);
