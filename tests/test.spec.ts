import { describe, it, expect } from "vitest";
import dedent from "dedent";
import * as prettier from "prettier";

import { process } from "./util/index";

describe("reyhpe-pre-language", () => {
  let html: string;

  // ******************************************
  it("effectless for inline codes", async () => {
    html = String(await process("`Hi`"));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<p>
        <code>Hi</code>
      </p>
      "
    `);
  });

  // ******************************************
  it("without any language", async () => {
    const input = dedent`
      \`\`\`
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>const a1=1; const a2=2; const a3=3;</code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with only language", async () => {
    const input = dedent`
      \`\`\`javascript
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input));

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
  it("with numbered and highlighted lines", async () => {
    const input = dedent`
      \`\`\`javascript {2} showLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input));

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
  it("with numbered from a specific starting number and highlighted lines", async () => {
    const input = dedent`
      \`\`\`javascript {2} showLineNumbers=11
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="11">
            <span class="hljs-keyword">const</span> a1=
            <span class="hljs-number">1</span>;
          </span>
          <span
            class="code-line numbered-code-line highlighted-code-line"
            data-line-number="12"
          >
            <span class="hljs-keyword">const</span> a2=
            <span class="hljs-number">2</span>;
          </span>
          <span class="code-line numbered-code-line" data-line-number="13">
            <span class="hljs-keyword">const</span> a3=
            <span class="hljs-number">3</span>;
          </span>
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with numbered (via settings) and highlighted lines", async () => {
    const input = dedent`
      \`\`\`javascript {2}
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input, { showLineNumbers: true }));

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
  it("with only language but numbered (via settings)", async () => {
    const input = dedent`
      \`\`\`javascript
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input, { showLineNumbers: true }));

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
  it("with noLineNumbers while numbered (via settings)", async () => {
    const input = dedent`
      \`\`\`javascript noLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input, { showLineNumbers: true }));

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
  it("with noLineNumbers while numbered (via settings) and higlight lines", async () => {
    const input = dedent`
      \`\`\`javascript noLineNumbers {2}
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input, { showLineNumbers: true }));

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
  it("without language and noLineNumbers while numbered (via settings)", async () => {
    const input = dedent`
      \`\`\`noLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input, { showLineNumbers: true }));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-unknown">const a1=1; const a2=2; const a3=3;</code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with numbered and highlighted lines, tag name is div", async () => {
    const input = dedent`
      \`\`\`javascript {2} showLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input, { lineContainerTagName: "div" }));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <div class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-keyword">const</span> a1=
            <span class="hljs-number">1</span>;
          </div>
          <div
            class="code-line numbered-code-line highlighted-code-line"
            data-line-number="2"
          >
            <span class="hljs-keyword">const</span> a2=
            <span class="hljs-number">2</span>;
          </div>
          <div class="code-line numbered-code-line" data-line-number="3">
            <span class="hljs-keyword">const</span> a3=
            <span class="hljs-number">3</span>;
          </div>
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("without language; numbered and highlighted lines", async () => {
    const input = dedent`
      \`\`\`{2} showLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-unknown">
          <span class="code-line numbered-code-line" data-line-number="1">
            const a1=1;
          </span>
          <span
            class="code-line numbered-code-line highlighted-code-line"
            data-line-number="2"
          >
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
  it("without language; only numbered lines", async () => {
    const input = dedent`
      \`\`\`showLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-unknown">
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
  it("without language; only highlighted lines", async () => {
    const input = dedent`
      \`\`\`{2}
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-unknown">
          <span class="code-line">const a1=1;</span>
          <span class="code-line highlighted-code-line">const a2=2;</span>
          <span class="code-line">const a3=3;</span>
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with diff", async () => {
    const input = dedent`
      \`\`\`diff showLineNumbers
      + const a1=1;
      - const a2=2;
      \`\`\`
    `;

    html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-diff">
          <span class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-addition">+ const a1=1;</span>
          </span>
          <span class="code-line numbered-code-line" data-line-number="2">
            <span class="hljs-deletion">- const a2=2;</span>
          </span>
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("empty number range is effectless", async () => {
    const input = dedent`
      \`\`\`js {}
      console.log("ipikuka");
      \`\`\`
    `;

    html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-js">
          <span class="hljs-variable language_">console</span>.
          <span class="hljs-title function_">log</span>(
          <span class="hljs-string">"ipikuka"</span>);
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with jsx but no code lines", async () => {
    const input = dedent`
      \`\`\`javascript
      function MyComponent() {
        return (
          <MDXClient
            {...mdxSource}
            components={components}
          />
        );
      };
      \`\`\`
    `;

    html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="hljs-keyword">function</span> <span class="hljs-title function_">MyComponent</span>(<span class="hljs-params"></span>) {
        <span class="hljs-keyword">return</span> (
          <span class="xml"><span class="hljs-tag">&#x3C;<span class="hljs-name">MDXClient</span>
            {<span class="hljs-attr">...mdxSource</span>}
            <span class="hljs-attr">components</span>=<span class="hljs-string">{components}</span>
          /></span></span>
        );
      };
      </code></pre>
      "
    `);
  });

  // ******************************************
  it("with jsx", async () => {
    const input = dedent`
      \`\`\`javascript showLineNumbers {4}
      function MyComponent() {
        return (
          <MDXClient
            {...mdxSource}
            components={components}
          />
        );
      };
      \`\`\`
    `;

    html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">function</span> <span class="hljs-title function_">MyComponent</span>() {</span>
      <span class="code-line numbered-code-line" data-line-number="2">  <span class="hljs-keyword">return</span> (</span>
      <span class="code-line numbered-code-line" data-line-number="3">    &#x3C;<span class="xml hljs-tag hljs-name">MDXClient</span></span>
      <span class="code-line numbered-code-line highlighted-code-line" data-line-number="4">      {<span class="xml hljs-tag hljs-attr">...mdxSource</span>}</span>
      <span class="code-line numbered-code-line" data-line-number="5">      <span class="xml hljs-tag hljs-attr">components</span>=<span class="xml hljs-tag hljs-string">{components}</span></span>
      <span class="code-line numbered-code-line" data-line-number="6">    /></span>
      <span class="code-line numbered-code-line" data-line-number="7">  );</span>
      <span class="code-line numbered-code-line" data-line-number="8">};</span>
      </code></pre>
      "
    `);
  });

  // ******************************************
  it("with jsx, tag name is div", async () => {
    const input = dedent`
      \`\`\`javascript showLineNumbers
      function MyComponent() {
        return (
          <MDXProvider>
            <MDXClient {...mdxSource} />
          </MDXProvider>
        );
      };
      \`\`\`
    `;

    html = String(await process(input, { lineContainerTagName: "div" }));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><div class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">function</span> <span class="hljs-title function_">MyComponent</span>() {</div><div class="code-line numbered-code-line" data-line-number="2">  <span class="hljs-keyword">return</span> (</div><div class="code-line numbered-code-line" data-line-number="3">    &#x3C;<span class="xml hljs-tag hljs-name">MDXProvider</span>></div><div class="code-line numbered-code-line" data-line-number="4">      &#x3C;<span class="xml hljs-tag hljs-name">MDXClient</span> {<span class="xml hljs-tag hljs-attr">...mdxSource</span>} /></div><div class="code-line numbered-code-line" data-line-number="5">    &#x3C;/<span class="xml hljs-tag hljs-name">MDXProvider</span>></div><div class="code-line numbered-code-line" data-line-number="6">  );</div><div class="code-line numbered-code-line" data-line-number="7">};</div></code></pre>
      "
    `);
  });
});
