import { describe, it, expect } from "vitest";

import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

import plugin from "../src";
import dedent from "dedent";

declare global {
  interface String {
    prettifyPre(): string;
  }
}

// it prettifies the <pre> opening tag putting new line right after
String.prototype.prettifyPre = function () {
  return this.replace(/<pre>(?!\n)/g, "<pre>\n");
};

// added for higher coverage result and covering edge-cases
describe("edge cases", () => {
  it("removes empty line, and highlight only the code lines", async () => {
    const html = dedent`
      <pre>
        <code class="language-javascript">
          let a;
        </code>
      </pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      // .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(html);

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="hljs-keyword">let</span> a;
        </code>
      </pre>"
    `);

    const file2 = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(html);

    expect(String(file2).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
      <span class="code-line numbered-code-line" data-line-number="1">    <span class="hljs-keyword">let</span> a;</span>
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

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(html);

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code><span class="code-line numbered-code-line" data-line-number="1">text</span></code>
        <code><span class="code-line numbered-code-line" data-line-number="1">text</span></code>
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

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(html);

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <button>click</button>
        <code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>;</span></code>
        <span>footer</span>
      </pre>"
    `);
  });

  it("should highlight and support line numbering for multiple `code`", async () => {
    const html = dedent`
      <pre>
        <code class="language-javascript">console.log("a")</code>
        <code class="language-python">printf("a")</code>
      </pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(html);

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"a"</span>)</span></code>
        <code class="hljs language-python"><span class="code-line numbered-code-line" data-line-number="1">printf(<span class="hljs-string">"a"</span>)</span></code>
      </pre>"
    `);
  });
});
