import { describe, it, expect } from "vitest";
import dedent from "dedent";
import * as prettier from "prettier";

import { processFromMd } from "./util/index";
import "./util/test-utils";

describe("reyhpe-highlight-code-lines, and line numbering (via settings)", () => {
  // ******************************************
  it("with language, tag name is 'span'", async () => {
    const input = dedent`
      \`\`\`javascript {2} showLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await processFromMd(input));

    expect(html).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">const</span> a1=<span class="hljs-number">1</span>;</span>
      <span class="code-line numbered-code-line highlighted-code-line" data-line-number="2"><span class="hljs-keyword">const</span> a2=<span class="hljs-number">2</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-keyword">const</span> a3=<span class="hljs-number">3</span>;</span>
      </code></pre>"
    `);

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-keyword">const</span> a1=
            <span class="hljs-number">1</span>;
          </span>
          <span
            class="code-line numbered-code-line highlighted-code-line"
            data-line-number="2"
          >
            <span class="hljs-keyword">const</span> a2=
            <span class="hljs-number">2</span>;
          </span>
          <span class="code-line numbered-code-line" data-line-number="3">
            <span class="hljs-keyword">const</span> a3=
            <span class="hljs-number">3</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("without language, with line numbering (via settings)", async () => {
    const input = dedent`
      \`\`\`
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html).toMatchInlineSnapshot(`
      "<pre><code><span class="code-line numbered-code-line" data-line-number="1">const a1=1;</span>
      <span class="code-line numbered-code-line" data-line-number="2">const a2=2;</span>
      <span class="code-line numbered-code-line" data-line-number="3">const a3=3;</span>
      </code></pre>"
    `);

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>
          <span class="code-line numbered-code-line" data-line-number="1">
            const a1=1;
          </span>
          <span class="code-line numbered-code-line" data-line-number="2">
            const a2=2;
          </span>
          <span class="code-line numbered-code-line" data-line-number="3">
            const a3=3;
          </span>
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with only language, with line numbering (via settings)", async () => {
    const input = dedent`
      \`\`\`javascript
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">const</span> a1=<span class="hljs-number">1</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-keyword">const</span> a2=<span class="hljs-number">2</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-keyword">const</span> a3=<span class="hljs-number">3</span>;</span>
      </code></pre>"
    `);

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-keyword">const</span> a1=
            <span class="hljs-number">1</span>;
          </span>
          <span class="code-line numbered-code-line" data-line-number="2">
            <span class="hljs-keyword">const</span> a2=
            <span class="hljs-number">2</span>;
          </span>
          <span class="code-line numbered-code-line" data-line-number="3">
            <span class="hljs-keyword">const</span> a3=
            <span class="hljs-number">3</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with language, with line highlighting and line numbering (via settings)", async () => {
    const input = dedent`
      \`\`\`javascript {2}
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">const</span> a1=<span class="hljs-number">1</span>;</span>
      <span class="code-line numbered-code-line highlighted-code-line" data-line-number="2"><span class="hljs-keyword">const</span> a2=<span class="hljs-number">2</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-keyword">const</span> a3=<span class="hljs-number">3</span>;</span>
      </code></pre>"
    `);

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-keyword">const</span> a1=
            <span class="hljs-number">1</span>;
          </span>
          <span
            class="code-line numbered-code-line highlighted-code-line"
            data-line-number="2"
          >
            <span class="hljs-keyword">const</span> a2=
            <span class="hljs-number">2</span>;
          </span>
          <span class="code-line numbered-code-line" data-line-number="3">
            <span class="hljs-keyword">const</span> a3=
            <span class="hljs-number">3</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with language, with noLineNumbers while line numbering (via settings)", async () => {
    const input = dedent`
      \`\`\`javascript noLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="hljs-keyword">const</span> a1=<span class="hljs-number">1</span>;
      <span class="hljs-keyword">const</span> a2=<span class="hljs-number">2</span>;
      <span class="hljs-keyword">const</span> a3=<span class="hljs-number">3</span>;
      </code></pre>"
    `);

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="hljs-keyword">const</span> a1=
          <span class="hljs-number">1</span>;<span class="hljs-keyword">const</span>{" "}
          a2=<span class="hljs-number">2</span>;
          <span class="hljs-keyword">const</span> a3=
          <span class="hljs-number">3</span>;
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with language, with noLineNumbers while line numbering (via settings) and line higlighting", async () => {
    const input = dedent`
      \`\`\`javascript noLineNumbers {2}
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line"><span class="hljs-keyword">const</span> a1=<span class="hljs-number">1</span>;</span>
      <span class="code-line highlighted-code-line"><span class="hljs-keyword">const</span> a2=<span class="hljs-number">2</span>;</span>
      <span class="code-line"><span class="hljs-keyword">const</span> a3=<span class="hljs-number">3</span>;</span>
      </code></pre>"
    `);

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line">
            <span class="hljs-keyword">const</span> a1=
            <span class="hljs-number">1</span>;
          </span>
          <span class="code-line highlighted-code-line">
            <span class="hljs-keyword">const</span> a2=
            <span class="hljs-number">2</span>;
          </span>
          <span class="code-line">
            <span class="hljs-keyword">const</span> a3=
            <span class="hljs-number">3</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("without language, with noLineNumbers while line numbering (via settings)", async () => {
    const input = dedent`
      \`\`\`noLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html).toMatchInlineSnapshot(`
      "<pre><code>const a1=1;
      const a2=2;
      const a3=3;
      </code></pre>"
    `);

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>const a1=1; const a2=2; const a3=3;</code>
      </pre>
      "
    `);
  });
});
