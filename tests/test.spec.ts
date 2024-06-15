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
          <div class="code-line numbered-code-line" data-line-number="1">
            const a1=1;
          </div>
          <div
            class="code-line numbered-code-line highlighted-code-line"
            data-line-number="2"
          >
            const a2=2;
          </div>
          <div class="code-line numbered-code-line" data-line-number="3">
            const a3=3;
          </div>
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
          <div class="code-line numbered-code-line" data-line-number="1">
            const a1=1;
          </div>
          <div class="code-line numbered-code-line" data-line-number="2">
            const a2=2;
          </div>
          <div class="code-line numbered-code-line" data-line-number="3">
            const a3=3;
          </div>
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
          <div class="code-line">const a1=1;</div>
          <div class="code-line highlighted-code-line">const a2=2;</div>
          <div class="code-line">const a3=3;</div>
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
          <div class="code-line numbered-code-line" data-line-number="1">
            <span class="hljs-addition">+ const a1=1;</span>
          </div>
          <div class="code-line numbered-code-line" data-line-number="2">
            <span class="hljs-deletion">- const a2=2;</span>
          </div>
        </code>
      </pre>
      "
    `);
  });

  // ******************************************
  it("effectless, with empty number range", async () => {
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
});
