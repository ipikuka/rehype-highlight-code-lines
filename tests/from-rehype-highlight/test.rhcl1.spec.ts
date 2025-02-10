import { describe, it, expect } from "vitest";

import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import dedent from "dedent";

import plugin from "../../src";

// prettify <pre> putting new line right after opening tag
String.prototype.prettifyPre = function () {
  return this.replace(/<pre>(?!\n)/g, "<pre>\n");
};

// all the test is taken from `rehype-highlight` for reference
// added `rehype-highlight-code-lines` without options to see no change the test results
describe("reyhpe-highlight and effectless reyhpe-highlight-code-lines", () => {
  it("should expose the public api", async () => {
    expect(Object.keys(await import("rehype-highlight")).sort()).toEqual(["default"]);
  });

  it("should work on empty code", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code></code></pre>
    `;

    const file2 = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true })
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file2)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs"></code></pre>"
    `);
  });

  it("should not highlight (no class)", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>"
    `);
  });

  it("should highlight (`detect`, no class)", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true })
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>;</code></pre>"
    `);
  });

  it("should highlight (detect, no class, subset)", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true, subset: ["arduino"] })
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-arduino"><span class="hljs-string">"use strict"</span>;</code></pre>"
    `);
  });

  it("should not highlight (`detect: false`, no class)", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: false })
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>"
    `);
  });

  it("should highlight (prefix without dash)", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true, prefix: "foo" })
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="foo language-javascript"><span class="foometa">"use strict"</span>;</code></pre>"
    `);
  });

  it("should highlight (prefix with dash)", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code>"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true, prefix: "foo-" })
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="foo language-javascript"><span class="foo-meta">"use strict"</span>;</code></pre>"
    `);
  });

  it("should highlight (lang class)", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="lang-js">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>"
    `);
  });

  it("should highlight (language class)", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="language-js">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>"
    `);
  });

  it("should highlight (long name)", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="language-javascript">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-javascript"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>"
    `);
  });

  it("should not highlight (`no-highlight`)", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="no-highlight">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="no-highlight">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>"
    `);
  });

  it("should prefer `no-highlight` over a `language-*` class", async () => {
    const input = dedent`
      <h1>Hello World!</h1>
      <pre><code class="lang-js no-highlight">alert(1)</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>
      <pre><code class="lang-js no-highlight">alert(1)</code></pre>"
    `);
  });

  it("should not highlight (`nohighlight`)", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="nohighlight">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="nohighlight">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>"
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
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(file.messages.map(String)).toEqual([
      "3:6-4:43: Cannot highlight as `foobar`, it’s not registered",
    ]);
  });

  it("should not highlight plainText-ed languages", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="lang-js">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { plainText: ["js"] })
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="lang-js">var name = "World";
      console.log("Hello, " + name + "!")</code></pre>"
    `);
  });

  it("should not remove contents", async () => {
    const input = dedent`
      <pre><code>def add(a, b):
        return a + b</code></pre>
    `;

    // For some reason this isn’t detected as c++.
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true, subset: ["cpp"] })
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toEqual(
      '<pre><code class="hljs">def add(a, b):\n  return a + b</code></pre>',
    );

    expect(String(file)).toMatchInlineSnapshot(`
      "<pre><code class="hljs">def add(a, b):
        return a + b</code></pre>"
    `);
  });

  it("should support multiple `code`s in a `pre`", async () => {
    const input = dedent`
      <pre>
        <code class="language-javascript">const a = 1;</code>
        <code class="language-python">printf("x")</code>
      </pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>;</code>
        <code class="hljs language-python">printf(<span class="hljs-string">"x"</span>)</code>
      </pre>"
    `);
  });

  it("should reprocess exact", async () => {
    const expected = dedent`
      <h1>Hello World!</h1>

      <pre><code class="hljs lang-js">
        <span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;
        <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)
      </code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin)
      .use(rehypeStringify)
      .process(expected);

    expect(String(file)).toEqual(expected);
  });

  it("should parse custom language", async () => {
    const input = '<pre><code class="lang-funkyscript">let a;</code></pre>';

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, {
        aliases: { javascript: ["funkyscript"] },
      })
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(
      `"<pre><code class="hljs lang-funkyscript"><span class="hljs-keyword">let</span> a;</code></pre>"`,
    );
  });

  it("should ignore comments", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code><!--TODO-->"use strict";</code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true })
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>;</code></pre>"
    `);
  });

  it("should support `<br>` elements", async () => {
    const input = dedent`
      <h1>Hello World!</h1>

      <pre><code class="language-javascript">
      "use strict";<br>console.log("very strict")
      </code></pre>
    `;

    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-javascript"><span class="hljs-meta">
      "use strict"</span>;
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"very strict"</span>)
      </code></pre>"
    `);
  });

  it("should register languages", async () => {
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
      .use(plugin)
      .use(rehypeStringify)
      .process(input);

    expect(String(file)).toMatchInlineSnapshot(`
      "<h1>Hello World!</h1>

      <pre><code class="hljs language-test">alpha <span class="hljs-keyword">bravo</span> charlie</code></pre>"
    `);
  });
});
