import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { common, createLowlight } from "lowlight";
import { visit } from "unist-util-visit";
import { toText } from "hast-util-to-text";
import { removePosition } from "unist-util-remove-position";

// How rehype-highligt works from html!

const lowlight = createLowlight(common);

// input
const html_input = `<pre>
  <code class="language-javascript">
    "use strict";
  </code>
</pre>`;

console.log(html_input);

// HAST
const tree = fromHtml(html_input, { fragment: true });

removePosition(tree, { force: true });
console.dir(tree, { depth: null });

visit(tree, (node, index, parent) => {
  if (parent && typeof index === "number" && node.tagName === "code") {
    const text = toText(node, { whitespace: "pre" });
    console.log({ text });
    const highlighted = lowlight.highlight("javascript", text);
    console.dir(highlighted, { depth: null });
    node.children = structuredClone(highlighted.children);
    node.properties.className = ["hljs", `language-${highlighted.data.language}`];
  }
});

removePosition(tree, { force: true });
console.dir(tree, { depth: null });

// output
const html_output = String(toHtml(tree)).prettifyPre();

console.log(html_output);
