import { describe, it, expect } from "vitest";

import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import dedent from "dedent";

import plugin from "../../src";
import "../util/test-utils";

// all the test is taken from `rehype-highlight` for reference
// added `rehype-highlight-code-lines` with options to see effects
describe("reyhpe-highlight and reyhpe-highlight-code-lines together", () => {
  it("should expose the public api", async () => {
    expect(Object.keys(await import("rehype-highlight")).sort()).toEqual(["default"]);
  });

  it("should work on empty code, no line numbering due to lack of piece of code", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code></code></pre>
    `;

    const file2 = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file2)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs"></code></pre>"
    `);
  });

  it("should not highlight (no class), but add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code><span class="code-line numbered-code-line" data-line-number="1">"use strict";</span></code></pre>"
    `);
  });

  it("should highlight (`detect`, no class), and add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-meta">"use strict"</span>;</span></code></pre>"
    `);
  });

  it("should highlight (detect, no class, subset), and add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true, subset: ["arduino"] })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-arduino"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-string">"use strict"</span>;</span></code></pre>"
    `);
  });

  it("should not highlight (`detect: false`, no class), but add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: false })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code><span class="code-line numbered-code-line" data-line-number="1">"use strict";</span></code></pre>"
    `);
  });

  it("should highlight (prefix without dash), and add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true, prefix: "foo" })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="foo language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="foometa">"use strict"</span>;</span></code></pre>"
    `);
  });

  it("should highlight (prefix with dash), and add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true, prefix: "foo-" })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="foo language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="foo-meta">"use strict"</span>;</span></code></pre>"
    `);
  });

  it("should highlight (lang class), and add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="lang-js">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs lang-js"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</span></code></pre>"
    `);
  });

  it("should highlight (language class), and add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="language-js">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-js"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</span></code></pre>"
    `);
  });

  it("should highlight (long name), and add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="language-javascript">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</span></code></pre>"
    `);
  });

  it("should not highlight (`no-highlight`), but add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="no-highlight">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="no-highlight"><span class="code-line numbered-code-line" data-line-number="1">var name = "World";</span>
      <span class="code-line numbered-code-line" data-line-number="2">console.log("Hello, " + name + "!")</span></code></pre>"
    `);
  });

  it("should prefer `no-highlight` over a `language-*` class, but add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="lang-js no-highlight">alert(1)</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="lang-js no-highlight"><span class="code-line numbered-code-line" data-line-number="1">alert(1)</span></code></pre>"
    `);
  });

  it("should not highlight (`nohighlight`), but add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="nohighlight">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="nohighlight"><span class="code-line numbered-code-line" data-line-number="1">var name = "World";</span>
      <span class="code-line numbered-code-line" data-line-number="2">console.log("Hello, " + name + "!")</span></code></pre>"
    `);
  });

  it("should warn on missing languages", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="lang-foobar">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(file.messages.map(String)).toEqual([
      "3:6-4:43: Cannot highlight as `foobar`, it’s not registered",
    ]);
  });

  it("should not highlight plainText-ed languages, but add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="lang-js">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { plainText: ["js"] })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="lang-js"><span class="code-line numbered-code-line" data-line-number="1">var name = "World";</span>
      <span class="code-line numbered-code-line" data-line-number="2">console.log("Hello, " + name + "!")</span></code></pre>"
    `);
  });

  it("should not remove contents, and add line numbering", async () => {
    const input = "<pre><code>def add(a, b):\n  return a + b</code></pre>";

    // For some reason this isn’t detected as c++.
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true, subset: ["cpp"] })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<pre><code class="hljs"><span class="code-line numbered-code-line" data-line-number="1">def add(a, b):</span>
      <span class="code-line numbered-code-line" data-line-number="2">  return a + b</span></code></pre>"
    `);
  });

  it("should support multiple `code`s in a `pre`, and add line numbering", async () => {
    const input = dedent`
      <pre>
        <code class="language-javascript">const a = 1;</code>
        <code class="language-python">printf("x")</code>
      </pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>;</span></code>
        <code class="hljs language-python"><span class="code-line numbered-code-line" data-line-number="1">printf(<span class="hljs-string">"x"</span>)</span></code>
      </pre>"
    `);
  });

  it("should reprocess exact", async () => {
    const expected = dedent`
      <h1>Hello World!</h1>

      <pre><code class="hljs lang-js">
      <span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</span>
      </code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true, trimBlankLines: true })
      .use(rehypeStringify)
      .process(expected);

    expect(String(file)).toEqual(expected);
  });

  it("should parse custom language, and add line numbering", async () => {
    const input = '<pre><code class="lang-funkyscript">let a;</code></pre>';

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, {
        aliases: { javascript: ["funkyscript"] },
      })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(
      `"<pre><code class="hljs lang-funkyscript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">let</span> a;</span></code></pre>"`,
    );
  });

  it("should ignore comments, and add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code><!--TODO-->"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-meta">"use strict"</span>;</span></code></pre>"
    `);
  });

  it("should support `<br>` elements, and add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="language-javascript">
      "use strict";<br>console.log("very strict");
      </code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true, trimBlankLines: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-javascript">
      <span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-meta">"use strict"</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"very strict"</span>);</span>
      </code></pre>"
    `);
  });

  it("should register languages, and add line numbering", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="language-test">alpha bravo charlie</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, {
        languages: {
          test() {
            return {
              aliases: [],
              contains: [],
              keywords: { keyword: "bravo" },
            };
          },
        },
      })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-test"><span class="code-line numbered-code-line" data-line-number="1">alpha <span class="hljs-keyword">bravo</span> charlie</span></code></pre>"
    `);
  });
});
