import { describe, it, expect } from "vitest";

import { unified } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import dedent from "dedent";

/**
 *
 * to console.log the tree as a plugin
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pluginLogTree = () => (tree: object) => {
  console.dir(
    JSON.parse(
      JSON.stringify(
        tree,
        function replacer(key, value) {
          if (key === "position") return undefined;
          else return value;
        },
        2,
      ),
    ),
    { depth: null },
  );
};

describe("pre code shouldn't produce blank lines", () => {
  it.only("trial", async () => {
    const input = dedent`
      \`\`\`javascript meta
      let a;
      \`\`\`

      <pre><code class="language-javascript">
      let a;
      </code></pre>     
    `;

    const file = await unified()
      .use(remarkParse)
      .use(gfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeHighlight)
      //   .use(pluginLogTree)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="hljs-keyword">let</span> a;
      </code></pre>
      <pre><code class="hljs language-javascript">
      <span class="hljs-keyword">let</span> a;
      </code></pre>"
    `);
  });
});
