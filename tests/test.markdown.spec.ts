import { describe, it, expect } from "vitest";
import dedent from "dedent";
import * as prettier from "prettier";

import { process } from "./util/index";

describe("reyhpe-highlight-code-lines", () => {
  // ******************************************
  it("effectless for inline codes", async () => {
    const html = String(await process("`Hi`"));

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

    const html = String(await process(input));

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

    const html = String(await process(input));

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
  it("with language, with only line numbering", async () => {
    const input = dedent`
      \`\`\`javascript showLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await process(input));

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
  it("with language, with only line highlighting", async () => {
    const input = dedent`
      \`\`\`javascript {2}
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await process(input));

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
  it("with language, with line numbering and line highlighting", async () => {
    const input = dedent`
      \`\`\`javascript {2} showLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await process(input));

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
  it("with language, with line highlighting and line numbering, tag name is still 'span' despite the option", async () => {
    const input = dedent`
      \`\`\`javascript {2} showLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await process(input, { lineContainerTagName: "div" }));

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
  it("with language, with line numbering starting from a specific number", async () => {
    const input = dedent`
      \`\`\`javascript showLineNumbers=11
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="code-line numbered-code-line" data-line-number="11">
            <span class="hljs-keyword">const</span> a1=
            <span class="hljs-number">1</span>;
          </span>
          <span class="code-line numbered-code-line" data-line-number="12">
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
  it("with language, with line numbering starting from a specific number and line highlighting", async () => {
    const input = dedent`
      \`\`\`javascript {2} showLineNumbers=11
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await process(input));

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
  it("without language, with line numbering and line highlighting", async () => {
    const input = dedent`
      \`\`\`showLineNumbers {2}
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>
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
  it("without language, with line highlighting and line numbering", async () => {
    const input = dedent`
      \`\`\`{2} showLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>
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
  it("without language, with only line numbering", async () => {
    const input = dedent`
      \`\`\`showLineNumbers
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await process(input));

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
  it("without language, with only line highlighting", async () => {
    const input = dedent`
      \`\`\`{2}
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>
          <span class="code-line">const a1=1;</span>
          <span class="code-line highlighted-code-line">const a2=2;</span>
          <span class="code-line">const a3=3;</span>
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("without language, with empty number range is effectless", async () => {
    const input = dedent`
      \`\`\`{}
      console.log("ipikuka");
      \`\`\`
    `;

    const html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>console.log("ipikuka");</code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("with language, empty number range is effectless", async () => {
    const input = dedent`
      \`\`\`js {}
      console.log("ipikuka");
      \`\`\`
    `;

    const html = String(await process(input));

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
  it("with language jsx", async () => {
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

    const html = String(await process(input));

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
  it.skip("with language jsx, after flattened, for reference, fake test", async () => {
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

    const html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="hljs-keyword">function</span> <span class="hljs-title function_">MyComponent</span>() {
        <span class="hljs-keyword">return</span> (
          &#x3C;<span class="xml hljs-tag hljs-name">MDXClient</span>
            {<span class="xml hljs-tag hljs-attr">...mdxSource</span>}
            <span class="xml hljs-tag hljs-attr">components</span>=<span class="xml hljs-tag hljs-string">{components}</span>
          />
        );
      };
      </code></pre>
      "
    `);
  });

  // ******************************************
  it("with language jsx, with line numbering and line highlighting", async () => {
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

    const html = String(await process(input));

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
  it("with language diff, with line numbering", async () => {
    const input = dedent`
      \`\`\`diff showLineNumbers
      + const a1=1;
      - const a2=2;
      \`\`\`
    `;

    const html = String(await process(input));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-diff">
          <span class="code-line numbered-code-line inserted" data-line-number="1">
            <span class="hljs-addition">+ const a1=1;</span>
          </span>
          <span class="code-line numbered-code-line deleted" data-line-number="2">
            <span class="hljs-deletion">- const a2=2;</span>
          </span>
        </code>
      </pre>
      "
    `);
  });
});

describe("reyhpe-highlight-code-lines, and line numbering (via settings)", () => {
  // ******************************************
  it("without language, with line numbering (via settings)", async () => {
    const input = dedent`
      \`\`\`
      const a1=1;
      const a2=2;
      const a3=3;
      \`\`\`
    `;

    const html = String(await process(input, { showLineNumbers: true }));

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

    const html = String(await process(input, { showLineNumbers: true }));

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

    const html = String(await process(input, { showLineNumbers: true }));

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

    const html = String(await process(input, { showLineNumbers: true }));

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

    const html = String(await process(input, { showLineNumbers: true }));

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

    const html = String(await process(input, { showLineNumbers: true }));

    expect(await prettier.format(html, { parser: "mdx" })).toMatchInlineSnapshot(`
      "<pre>
        <code>const a1=1; const a2=2; const a3=3;</code>
      </pre>
      "
    `);
  });
});

describe("reyhpe-highlight-code-lines, with extra blank lines", () => {
  // ******************************************
  it("inside extra blank lines - 11", async () => {
    const input = dedent`
      \`\`\`javascript

      "use strict";
      
      console.log("xxx");

      \`\`\`
    `;

    // the code value, for reference
    // '\n"use strict";\n\nconsole.log("xxx");\n\n'
    // ['\n"use strict"', ';\n\n', 'console', '.', 'log', '(', '"xxx"', ');\n\n']

    const html1 = String(await process(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="hljs-meta">
      "use strict"</span>;

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);

      </code></pre>"
    `);

    const html2 = String(await process(input, { showLineNumbers: true }));

    expect(html2).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-meta">"use strict"</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="3"></span>
      <span class="code-line numbered-code-line" data-line-number="4"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="5"></span>
      </code></pre>"
    `);
  });

  // ******************************************
  it("inside extra blank lines - 12", async () => {
    const input = dedent`
      \`\`\`javascript


      "use strict";
      
      console.log("xxx");


      \`\`\`
    `;

    const html1 = String(await process(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="hljs-meta">

      "use strict"</span>;

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);


      </code></pre>"
    `);

    const html2 = String(await process(input, { showLineNumbers: true }));

    expect(html2).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"></span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-meta">"use strict"</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="4"></span>
      <span class="code-line numbered-code-line" data-line-number="5"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="6"></span>
      <span class="code-line numbered-code-line" data-line-number="7"></span>
      </code></pre>"
    `);
  });

  // ******************************************
  it("inside extra blank lines - 21", async () => {
    const input = dedent`
      \`\`\`javascript

      console.log("xxx");

      let a = 1;
      
      \`\`\`
    `;

    const html1 = String(await process(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);

      <span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;

      </code></pre>"
    `);

    const html2 = String(await process(input, { showLineNumbers: true }));

    expect(html2).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="3"></span>
      <span class="code-line numbered-code-line" data-line-number="4"><span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="5"></span>
      </code></pre>"
    `);
  });

  // ******************************************
  it("inside extra blank lines - 22", async () => {
    const input = dedent`
      \`\`\`javascript


      let a = 1;
      
      console.log("xxx");


      \`\`\`
    `;

    const html1 = String(await process(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">

      <span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);


      </code></pre>"
    `);

    const html2 = String(await process(input, { showLineNumbers: true }));

    expect(html2).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"></span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="4"></span>
      <span class="code-line numbered-code-line" data-line-number="5"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="6"></span>
      <span class="code-line numbered-code-line" data-line-number="7"></span>
      </code></pre>"
    `);
  });

  // ******************************************
  it("inside extra blank lines - 31, double comments", async () => {
    const input = dedent`
      \`\`\`javascript

      // comment 1
      // comment 2

      let a = 1;
      
      \`\`\`
    `;

    const html1 = String(await process(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">
      <span class="hljs-comment">// comment 1</span>
      <span class="hljs-comment">// comment 2</span>

      <span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;

      </code></pre>"
    `);

    const html2 = String(await process(input, { showLineNumbers: true }));

    expect(html2).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-comment">// comment 1</span></span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-comment">// comment 2</span></span>
      <span class="code-line numbered-code-line" data-line-number="4"></span>
      <span class="code-line numbered-code-line" data-line-number="5"><span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="6"></span>
      </code></pre>"
    `);
  });

  // ******************************************
  it("inside extra blank lines - 32, multiline comment", async () => {
    const input = dedent`
      \`\`\`javascript


      /**
       * comment1
       */
      
      console.log("xxx");


      \`\`\`
    `;

    const html1 = String(await process(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">

      <span class="hljs-comment">/**
       * comment1
       */</span>

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);


      </code></pre>"
    `);

    const html2 = String(await process(input, { showLineNumbers: true }));

    expect(html2).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"></span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-comment">/**</span></span>
      <span class="code-line numbered-code-line" data-line-number="4"><span class="hljs-comment"> * comment1</span></span>
      <span class="code-line numbered-code-line" data-line-number="5"><span class="hljs-comment"> */</span></span>
      <span class="code-line numbered-code-line" data-line-number="6"></span>
      <span class="code-line numbered-code-line" data-line-number="7"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="8"></span>
      <span class="code-line numbered-code-line" data-line-number="9"></span>
      </code></pre>"
    `);
  });
});
