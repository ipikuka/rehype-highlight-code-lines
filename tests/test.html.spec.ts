import { describe, it, expect } from "vitest";
import dedent from "dedent";

import "./util/test-utils";
import { processFromHtml } from "./util";

describe("rehype-highlight-code-line, with html sources", () => {
  it("should not highlight but support line numbering for text 1", async () => {
    const html = dedent`
      <pre><code>text</code></pre>
    `;

    const file = String(await processFromHtml(html, { showLineNumbers: true }));

    expect(String(file)).toMatchInlineSnapshot(`
      "<pre><code><span class="code-line numbered-code-line" data-line-number="1">text</span></code></pre>"`);
  });

  it("should not highlight but support line numbering for text 2", async () => {
    const html = dedent`
      <pre>
        <code>text</code>
      </pre>
    `;

    const file = String(await processFromHtml(html, { showLineNumbers: true }));

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code><span class="code-line numbered-code-line" data-line-number="1">text</span></code>
      </pre>"
    `);
  });

  it("should not highlight but support line numbering for text 3", async () => {
    const html = dedent`
      <pre>
        <code>text\ntext</code>
      </pre>
    `;

    const file = String(await processFromHtml(html, { showLineNumbers: true }));

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code><span class="code-line numbered-code-line" data-line-number="1">text</span>
      <span class="code-line numbered-code-line" data-line-number="2">text</span></code>
      </pre>"
    `);
  });

  it("should not highlight but support line numbering for text 4", async () => {
    const html = dedent`
      <pre>
        <code>
          text
          text
        </code>
      </pre>
    `;

    const file = String(await processFromHtml(html, { showLineNumbers: true }));

    expect(String(file).prettifyPreCode()).toMatchInlineSnapshot(`
      "<pre>
        <code>
      <span class="code-line numbered-code-line" data-line-number="1">    text</span>
      <span class="code-line numbered-code-line" data-line-number="2">    text</span>
        </code>
      </pre>"
    `);
  });

  it("should highlight and support line numbering 1", async () => {
    const html = dedent`
      <pre>
        <code class="language-javascript">console.log("a");</code>
      </pre>
    `;

    const file = String(await processFromHtml(html, { showLineNumbers: true }));

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"a"</span>);</span></code>
      </pre>"
    `);
  });

  it("should highlight and support line numbering 2", async () => {
    const html = dedent`
      <pre>
        <code class="language-javascript">
          console.log("a");
        </code>
      </pre>
    `;

    const file = String(await processFromHtml(html, { showLineNumbers: true }));

    expect(String(file).prettifyPreCode()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
      <span class="code-line numbered-code-line" data-line-number="1">    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"a"</span>);</span>
        </code>
      </pre>"
    `);
  });

  it("should highlight and support line numbering 3", async () => {
    const html = dedent`
      <pre>
        <code class="language-javascript">"use scrict";</code>
      </pre>
    `;

    const file = String(await processFromHtml(html, { showLineNumbers: true }));

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-string">"use scrict"</span>;</span></code>
      </pre>"
    `);
  });

  it("should highlight and support line numbering 4", async () => {
    const html = dedent`
      <pre>
        <code class="language-javascript">
          "use scrict";
        </code>
      </pre>
    `;

    const file = String(await processFromHtml(html, { showLineNumbers: true }));

    expect(String(file).prettifyPreCode()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
      <span class="code-line numbered-code-line" data-line-number="1">    <span class="hljs-string">"use scrict"</span>;</span>
        </code>
      </pre>"
    `);
  });

  it("should not highlight but support line numbering for multiple `code`", async () => {
    const html = dedent`
      <pre>
        <code>text</code>
        <code>text</code>
      </pre>
    `;

    const file = String(await processFromHtml(html, { showLineNumbers: true }));

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code><span class="code-line numbered-code-line" data-line-number="1">text</span></code>
        <code><span class="code-line numbered-code-line" data-line-number="1">text</span></code>
      </pre>"
    `);
  });

  it("should highlight and support line numbering for multiple `code`", async () => {
    const html = dedent`
      <pre>
        <code class="language-javascript">console.log("a");</code>
        <code class="language-python">printf("a");</code>
      </pre>
    `;

    const file = String(await processFromHtml(html, { showLineNumbers: true }));

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"a"</span>);</span></code>
        <code class="hljs language-python"><span class="code-line numbered-code-line" data-line-number="1">printf(<span class="hljs-string">"a"</span>);</span></code>
      </pre>"
    `);
  });

  it("should highlight and support line numbering for multiple `code`", async () => {
    const html = dedent`
      <pre>
        <code class="language-javascript">
          console.log("a");
        </code>
        <code class="language-python">
          printf("a");
        </code>
      </pre>
    `;

    const file = String(await processFromHtml(html, { showLineNumbers: true }));

    expect(String(file).prettifyPreCode()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
      <span class="code-line numbered-code-line" data-line-number="1">    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"a"</span>);</span>
        </code>
        <code class="hljs language-python">
      <span class="code-line numbered-code-line" data-line-number="1">    printf(<span class="hljs-string">"a"</span>);</span>
        </code>
      </pre>"
    `);
  });

  it("should keep elements as is other than `code` at both side", async () => {
    const html = dedent`
      <pre>
        <button>click</button>
        <code class="language-javascript">const a = 1;</code>
        <span>footer</span>
      </pre>
    `;

    const file = String(await processFromHtml(html, { showLineNumbers: true }));

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <button>click</button>
        <code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>;</span></code>
        <span>footer</span>
      </pre>"
    `);
  });
});
