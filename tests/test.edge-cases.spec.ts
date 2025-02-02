import { describe, it, expect } from "vitest";

import { rehype } from "rehype";
import rehypeHighlight from "rehype-highlight";

import plugin from "../src";

// added for higher coverage result and covering edge-cases
describe("edge cases", () => {
  it("if there are unnecessary spaces in pre", async () => {
    const html = `
      <pre><code>const a = 1;</code><code>const a = 1;
	  </code></pre>
	`;

    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .process(html);

    expect(String(file)).toMatchInlineSnapshot(`
      "
            <pre><code><span class="code-line numbered-code-line" data-line-number="1">const a = 1;</span></code><code><span class="code-line numbered-code-line" data-line-number="1">const a = 1;</span>
      <span class="code-line numbered-code-line" data-line-number="2">	  </span></code></pre>
      	"
    `);
  });

  it("if there are other elements than code in pre at the beginning and end", async () => {
    const html = `<pre><button>click</button><code class="language-javascript">const a = 1;</code><span>footer</span></pre>`;

    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .process(html);

    expect(String(file)).toMatchInlineSnapshot(
      `"<pre><button>click</button><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1">clickconst a = <span class="hljs-number">1</span>;footer</span></code><span>footer</span></pre>"`,
    );
  });

  it("if there are more than one than code in pre", async () => {
    const html = `<pre><code class="language-javascript">console.log("a")</code>
	<code class="language-phthon">printf("a")</code></pre>`;

    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .process(html);

    expect(String(file)).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"a"</span>)</span>
      <span class="code-line numbered-code-line" data-line-number="2">	<span class="hljs-title function_">printf</span>(<span class="hljs-string">"a"</span>)</span></code>
      	<code class="hljs language-phthon"><span class="code-line numbered-code-line" data-line-number="1">printf("a")</span></code></pre>"
    `);
  });
});
