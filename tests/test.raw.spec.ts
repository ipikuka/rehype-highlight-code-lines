import { describe, it, expect } from "vitest";
import dedent from "dedent";
import * as prettier from "prettier";

import { processFromMd, processRawFirst, processRawAfter } from "./util/index";
import "./util/test-utils";

describe("reyhpe-highlight-code-lines with rehype-raw", () => {
  it("should highlight (from html in markdown)", async () => {
    const input = dedent`
	  Hello World

	  \`\`\`javascript showLineNumbers
      "use strict";
      \`\`\`

	  <h2>heading</h2>

	  <pre><code class="language-javascript">
	  var name = "World";
	  </code></pre>
	`;

    const html1 = String(await processFromMd(input));

    // code fence is highlihted and numbered
    // html is removed since lack of raw, it is okey
    expect(await prettier.format(html1, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<p>Hello World</p>
      <pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-meta"> "use strict"</span>;
          </span>
        </code>
      </pre>
      "
    `);

    const html2 = String(await processRawFirst(input));

    // code fence is highlihted but NOT numbered due to missing code.data.meta
    // html part <pre> is highlihted but again NOT numbered (lack of directive for numbering), it is okey
    expect(await prettier.format(html2, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<p>Hello World</p>
      <pre>
        <code class="hljs language-javascript">
          <span class="hljs-meta"> "use strict"</span>;
        </code>
      </pre>
      <h2>heading</h2>
      <pre>
        <code class="hljs language-javascript">
          <span class="hljs-keyword">var</span> name ={" "}
          <span class="hljs-string">"World"</span>;
        </code>
      </pre>
      "
    `);

    const html3 = String(await processRawAfter(input));

    // code fence is highlihted and numbered since meta has not been destroyed yet by rehype-raw
    // html part <pre> is NOY highlihted and NOT numbered since html part is rendered after
    expect(await prettier.format(html3, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<p>Hello World</p>
      <pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-meta"> "use strict"</span>;
          </span>
        </code>
      </pre>
      <h2>heading</h2>
      <pre>
        <code class="language-javascript">var name = "World";</code>
      </pre>
      "
    `);
  });
});
