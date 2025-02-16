import { describe, it, expect } from "vitest";

import { unified } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import dedent from "dedent";

import plugin from "./../src";
import "./util/test-utils";

/**
 *
 * to console.log the tree as a plugin
 *
 */
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
  it("trial", async () => {
    const input = dedent`
      \`\`\`javascript meta
      
      "use strict";
      
      console.log("next-mdx-remote-client");
      
      \`\`\`

      Hello World

      <pre><code class="language-javascript">
      
      "use strict";
      
      console.log("next-mdx-remote-client");
      
      </code></pre>     
    `;

    const file1 = await unified()
      .use(remarkParse)
      .use(gfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeHighlight)
      .use(pluginLogTree)
      .use(rehypeStringify)
      .process(input);

    expect(String(file1)).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="hljs-meta">
      "use strict"</span>;

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"next-mdx-remote-client"</span>);

      </code></pre>
      <p>Hello World</p>
      <pre><code class="hljs language-javascript"><span class="hljs-meta">

      "use strict"</span>;

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"next-mdx-remote-client"</span>);

      </code></pre>"
    `);

    const file2 = await unified()
      .use(remarkParse)
      .use(gfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeHighlight)
      .use(plugin)
      .use(pluginLogTree)
      .use(rehypeStringify)
      .process(input);

    // TODO: rehypeRaw destroys the code.data.meta, hence code fence doesn't work
    expect(String(file2)).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="hljs-meta">
      "use strict"</span>;

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"next-mdx-remote-client"</span>);

      </code></pre>
      <p>Hello World</p>
      <pre><code class="hljs language-javascript"><span class="hljs-meta">

      "use strict"</span>;

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"next-mdx-remote-client"</span>);

      </code></pre>"
    `);
  });
});
