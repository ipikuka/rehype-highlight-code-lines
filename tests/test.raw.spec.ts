import { describe, it, expect } from "vitest";
import dedent from "dedent";
import * as prettier from "prettier";

import { processFromMd, processRawFirst, processRawAfter } from "./util/index";
import "./util/test-utils";

describe("reyhpe-highlight-code-lines with rehype-raw (html nodes in markdown) ", () => {
  it("should remove html nodes since there is no rehype-raw", async () => {
    const input = dedent`
      Hello World

      \`\`\`javascript showLineNumbers
      "use strict";
      \`\`\`

      <h2>heading</h2>

      <pre><code class="language-javascript showlinenumbers">
      var name = "World";
      </code></pre>
    `;

    const html = String(await processFromMd(input));

    // code fence is highlihted and numbered, it is okey
    // html is removed since lack of rehay-raw, it is okey
    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<p>Hello World</p>
      <pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-meta">"use strict"</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  it("reyhpe-raw is used before plugins", async () => {
    const input = dedent`
      Hello World

      \`\`\`javascript showLineNumbers
      "use strict";
      \`\`\`

      <h2>heading</h2>

      <pre><code class="language-javascript showLineNumbers trimBlankLines">
      var name = "World";
      </code></pre>
    `;

    const html = String(await processRawFirst(input));

    // code fence is highlighted but NOT numbered due to missing code.data.meta (by hast-util-raw)
    // html part <pre> is highlihted and numbered, it is okey
    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<p>Hello World</p>
      <pre>
        <code class="hljs language-javascript">
          <span class="hljs-meta">"use strict"</span>;
        </code>
      </pre>
      <h2>heading</h2>
      <pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-keyword">var</span> name ={" "}
            <span class="hljs-string">"World"</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  it("reyhpe-raw is used before plugins", async () => {
    const input = dedent`
      Hello World

      \`\`\`javascript showLineNumbers
      "use strict";
      \`\`\`

      <h2>heading</h2>

      <pre><code class="language-javascript showlinenumbers">
      var name = "World";
      </code></pre>
    `;

    const html = String(await processRawAfter(input));

    // code fence is highlihted and numbered since meta has not been destroyed yet by rehype-raw
    // html part <pre> is NOT highlihted and NOT numbered since html part is rendered after
    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<p>Hello World</p>
      <pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-meta">"use strict"</span>;
          </span>
        </code>
      </pre>
      <h2>heading</h2>
      <pre>
        <code class="language-javascript showlinenumbers">var name = "World";</code>
      </pre>
      "
    `);
  });
});

describe("reyhpe-highlight-code-lines with rehype-raw (html nodes in markdown) 2", () => {
  it("should highlight (only)", async () => {
    const input = dedent`
      <pre><code class="language-javascript">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="hljs-keyword">let</span> name ={" "}
          <span class="hljs-string">"ipikuka"</span>;
        </code>
      </pre>
      "
    `);
  });

  it("should highlight, and add numbering (via settings)", async () => {
    const input = dedent`
      <pre><code class="language-javascript">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input, { showLineNumbers: true }));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1"></span>
          <span class="code-line numbered-code-line" data-line-number="2">
            <span class="hljs-keyword">let</span> name ={" "}
            <span class="hljs-string">"ipikuka"</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  it("should highlight, and add numbering (via settings), trim blank lines", async () => {
    const input = dedent`
      <pre><code class="language-javascript">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(
      await processRawFirst(input, { showLineNumbers: true, trimBlankLines: true }),
    );

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-keyword">let</span> name ={" "}
            <span class="hljs-string">"ipikuka"</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  it("should highlight (only), and no numbering (while numbering via settings) 1", async () => {
    const input = dedent`
      <pre><code class="language-javascript nolinenumbers">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input, { showLineNumbers: true }));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="hljs-keyword">let</span> name ={" "}
          <span class="hljs-string">"ipikuka"</span>;
        </code>
      </pre>
      "
    `);
  });

  it("should highlight (only), and no numbering (while numbering via settings) 2", async () => {
    const input = dedent`
      <pre><code class="language-javascript no-line-numbers">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input, { showLineNumbers: true }));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="hljs-keyword">let</span> name ={" "}
          <span class="hljs-string">"ipikuka"</span>;
        </code>
      </pre>
      "
    `);
  });

  it("should highlight (only), and no numbering (while numbering via settings) 3", async () => {
    const input = dedent`
      <pre><code class="language-javascript noLineNumbers">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input, { showLineNumbers: true }));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="hljs-keyword">let</span> name ={" "}
          <span class="hljs-string">"ipikuka"</span>;
        </code>
      </pre>
      "
    `);
  });

  it("should highlight, and add numbering", async () => {
    const input = dedent`
      <pre><code class="language-javascript showlinenumbers">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input, { showLineNumbers: true }));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1"></span>
          <span class="code-line numbered-code-line" data-line-number="2">
            <span class="hljs-keyword">let</span> name ={" "}
            <span class="hljs-string">"ipikuka"</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  it("should highlight, and add numbering and trim blank lines 1", async () => {
    const input = dedent`
      <pre><code class="language-javascript showlinenumbers trimblanklines">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(
      await processRawFirst(input, { showLineNumbers: true, trimBlankLines: true }),
    );

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-keyword">let</span> name ={" "}
            <span class="hljs-string">"ipikuka"</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  it("should highlight, and add numbering and trim blank lines 2", async () => {
    const input = dedent`
      <pre><code class="language-javascript show-line-numbers trim-blank-lines">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(
      await processRawFirst(input, { showLineNumbers: true, trimBlankLines: true }),
    );

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-keyword">let</span> name ={" "}
            <span class="hljs-string">"ipikuka"</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  it("should highlight, and add numbering and trim blank lines 3", async () => {
    const input = dedent`
      <pre><code class="language-javascript showLineNumbers trimBlankLines">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(
      await processRawFirst(input, { showLineNumbers: true, trimBlankLines: true }),
    );

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-keyword">let</span> name ={" "}
            <span class="hljs-string">"ipikuka"</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  it("should highlight, and add numbering and trim blank lines 3", async () => {
    const input = dedent`
      <pre><code class="language-javascript showLineNumbers trimBlankLines" data-start-numbering=33 data-highlight-lines="3,4">
      "use strict"
      // comment-1
      let a;
      let b;
      // comment-2
      </code></pre>
    `;

    const html = String(
      await processRawFirst(input, { showLineNumbers: true, trimBlankLines: true }),
    );

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="33">
            <span class="hljs-meta">"use strict"</span>
          </span>
          <span class="code-line numbered-code-line" data-line-number="34">
            <span class="hljs-comment">// comment-1</span>
          </span>
          <span
            class="code-line numbered-code-line highlighted-code-line"
            data-line-number="35"
          >
            <span class="hljs-keyword">let</span> a;
          </span>
          <span
            class="code-line numbered-code-line highlighted-code-line"
            data-line-number="36"
          >
            <span class="hljs-keyword">let</span> b;
          </span>
          <span class="code-line numbered-code-line" data-line-number="37">
            <span class="hljs-comment">// comment-2</span>
          </span>
        </code>
      </pre>
      "
    `);
  });
});

describe("reyhpe-highlight-code-lines with rehype-raw (html nodes in markdown) 3", () => {
  it("without code highlighting, only numbering", async () => {
    const input = dedent`
      <pre><code class="show-line-numbers">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>
          <span class="code-line numbered-code-line" data-line-number="1"></span>
          <span class="code-line numbered-code-line" data-line-number="2">
            let name = "ipikuka";
          </span>
        </code>
      </pre>
      "
    `);
  });

  it("without code highlighting, numbering and trimming", async () => {
    const input = dedent`
      <pre><code class="show-line-numbers trim-blank-lines">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>
          <span class="code-line numbered-code-line" data-line-number="1">
            let name = "ipikuka";
          </span>
        </code>
      </pre>
      "
    `);
  });

  it("without code highlighting, only trimming", async () => {
    const input = dedent`
      <pre><code class="trim-blank-lines">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>
          <span class="code-line">let name = "ipikuka";</span>
        </code>
      </pre>
      "
    `);
  });

  it("without code highlighting, only line highlighting", async () => {
    const input = dedent`
      <pre><code data-highlight-lines="2">
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>
          <span class="code-line"></span>
          <span class="code-line highlighted-code-line">let name = "ipikuka";</span>
        </code>
      </pre>
      "
    `);
  });

  it("without code highlighting, only start numbering", async () => {
    const input = dedent`
      <pre><code data-start-numbering=2>
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>
          <span class="code-line numbered-code-line" data-line-number="2"></span>
          <span class="code-line numbered-code-line" data-line-number="3">
            let name = "ipikuka";
          </span>
        </code>
      </pre>
      "
    `);
  });

  it("without code highlighting, only start numbering with zero", async () => {
    const input = dedent`
      <pre><code data-start-numbering=0>
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>
          <span class="code-line numbered-code-line" data-line-number="0"></span>
          <span class="code-line numbered-code-line" data-line-number="1">
            let name = "ipikuka";
          </span>
        </code>
      </pre>
      "
    `);
  });

  it("without code highlighting, missing start numbering", async () => {
    const input = dedent`
      <pre><code data-start-numbering>
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>let name = "ipikuka";</code>
      </pre>
      "
    `);
  });

  it("without code highlighting, invalid start numbering", async () => {
    const input = dedent`
      <pre><code data-start-numbering=true>
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>let name = "ipikuka";</code>
      </pre>
      "
    `);
  });

  it("without code highlighting, no numbering while start numbering exists", async () => {
    const input = dedent`
      <pre><code class="no-line-numbers" data-start-numbering=2>
      let name = "ipikuka";
      </code></pre>
    `;

    const html = String(await processRawFirst(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>let name = "ipikuka";</code>
      </pre>
      "
    `);
  });
});
