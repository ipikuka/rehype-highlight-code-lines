import { describe, it, expect } from "vitest";

import { unified } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import dedent from "dedent";

import type { Plugin } from "unified";
import type { Root } from "hast";
import { visit, type VisitorResult } from "unist-util-visit";

import plugin from "./../src";
import "./util/test-utils";

/**
 *
 * log the tree without position info as a rehype plugin
 *
 */
const pluginLogTree: Plugin<void[], Root> = () => {
  return (tree: Root): undefined => {
    console.dir(
      JSON.parse(
        JSON.stringify(
          tree,
          function replacer(key, value) {
            return key === "position" ? undefined : value;
          },
          2,
        ),
      ),
      { depth: null },
    );
  };
};

/**
 *
 * copy code.data.meta into code.properties.metastring
 *
 * use it before rehype-raw since it destroys the code.data.meta
 *
 */
const pluginMeta: Plugin<void[], Root> = () => {
  return (tree: Root): undefined => {
    visit(tree, "element", function (code, index, parent): VisitorResult {
      if (!parent || index === undefined || code.tagName !== "code") {
        return;
      }

      if (parent.type !== "element" || parent.tagName !== "pre") {
        return;
      }

      code.properties.metastring = code.data?.meta;
    });
  };
};

describe("pre code shouldn't produce blank lines", () => {
  it("without plugin rehype-highlight-code-line", async () => {
    const input = dedent`
      \`\`\`javascript
      
      "use strict";
      
      console.log("next-mdx-remote-client");
      
      \`\`\`

      Hello World

      <pre><code class="language-javascript">
      
      "use strict";
      
      console.log("next-mdx-remote-client");
      
      </code></pre>     
    `;

    const file = await unified()
      .use(remarkParse)
      .use(gfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeHighlight)
      .use(pluginLogTree)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
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

  it("without plugin rehype-highlight-code-line 2", async () => {
    const input = dedent`
      \`\`\`javascript showLineNumbers
      
      "use strict";
      
      console.log("next-mdx-remote-client");
      
      \`\`\`

      Hello World

      <pre><code class="language-javascript show-line-numbers">
      
      "use strict";
      
      console.log("next-mdx-remote-client");
      
      </code></pre>     
    `;

    const file = await unified()
      .use(remarkParse)
      .use(gfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(pluginMeta)
      .use(rehypeRaw)
      .use(rehypeHighlight)
      .use(pluginLogTree)
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    // TODO: the second produce extra blank line in the beginning, how to understand it is code fence or code fragment ?
    expect(String(file)).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-meta">"use strict"</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="2"></span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"next-mdx-remote-client"</span>);</span>
      </code></pre>
      <p>Hello World</p>
      <pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-meta">"use strict"</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="3"></span>
      <span class="code-line numbered-code-line" data-line-number="4"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"next-mdx-remote-client"</span>);</span>
      </code></pre>"
    `);
  });
});
