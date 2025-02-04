import { describe, it, expect } from "vitest";

import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import { common, type LanguageFn } from "lowlight";

import plugin from "../src";

// all the test is taken from `rehype-highlight` for reference
// only added `rehype-highlight-code-lines` to see no change the test results
describe("reyhpe-highlight-code-lines", () => {
  const testLang: LanguageFn = function () {
    return {
      aliases: ["test"],
      contains: [],
      keywords: { keyword: "test" },
    };
  };

  it("should work on empty code, no line numbering due to lack of piece of code", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process("<pre><code></code></pre>");

    expect(String(file)).toEqual('<pre><code class="hljs"></code></pre>');
  });

  it("should not highlight (no class), but add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process('<pre><code>"use strict";</code></pre>');

    expect(String(file)).toEqual(
      [
        "<pre><code>",
        '<span class="code-line numbered-code-line" data-line-number="1">"use strict";</span>',
        "</code></pre>",
      ].join(""),
    );
  });

  it("should highlight (`detect`, no class), and add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process('<pre><code>"use strict";</code></pre>');

    expect(String(file)).toEqual(
      [
        '<pre><code class="hljs language-javascript">',
        '<span class="code-line numbered-code-line" data-line-number="1">',
        '<span class="hljs-meta">"use strict"</span>;',
        "</span></code></pre>",
      ].join(""),
    );
  });

  it("should highlight (detect, no class, subset), and add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true, subset: ["arduino"] })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process('<pre><code>"use strict";</code></pre>');

    expect(String(file)).toEqual(
      [
        '<pre><code class="hljs language-arduino">',
        '<span class="code-line numbered-code-line" data-line-number="1">',
        '<span class="hljs-string">"use strict"</span>;',
        "</span></code></pre>",
      ].join(""),
    );
  });

  it("should not highlight (`detect: false`, no class), but add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: false })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process('<pre><code>"use strict";</code></pre>');

    expect(String(file)).toEqual(
      [
        "<pre><code>",
        '<span class="code-line numbered-code-line" data-line-number="1">"use strict";</span>',
        "</code></pre>",
      ].join(""),
    );
  });

  it("should highlight (prefix without dash), and add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true, prefix: "foo" })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process('<pre><code>"use strict";</code></pre>');

    expect(String(file)).toEqual(
      [
        '<pre><code class="foo language-javascript">',
        '<span class="code-line numbered-code-line" data-line-number="1">',
        '<span class="foometa">"use strict"</span>;',
        "</span></code></pre>",
      ].join(""),
    );
  });

  it("should highlight (prefix with dash), and add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true, prefix: "foo-" })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process('<pre><code>"use strict";</code></pre>');

    expect(String(file)).toEqual(
      [
        '<pre><code class="foo language-javascript">',
        '<span class="code-line numbered-code-line" data-line-number="1">',
        '<span class="foo-meta">"use strict"</span>;',
        "</span></code></pre>",
      ].join(""),
    );
  });

  it("should highlight (lang class), and add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(
        [
          '<pre><code class="lang-js">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        [
          '<pre><code class="hljs lang-js">',
          '<span class="code-line numbered-code-line" data-line-number="1">',
          '<span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
          "</span>",
        ].join(""),
        [
          '<span class="code-line numbered-code-line" data-line-number="2">',
          '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>',
          '(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)',
          "</span></code></pre>",
        ].join(""),
      ].join("\n"),
    );
  });

  it("should highlight (language class), and add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(
        [
          '<pre><code class="language-js">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        [
          '<pre><code class="hljs language-js">',
          '<span class="code-line numbered-code-line" data-line-number="1">',
          '<span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
          "</span>",
        ].join(""),
        [
          '<span class="code-line numbered-code-line" data-line-number="2">',
          '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>',
          '(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)',
          "</span></code></pre>",
        ].join(""),
      ].join("\n"),
    );
  });

  it("should highlight (long name), and add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(
        [
          '<pre><code class="language-javascript">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        [
          '<pre><code class="hljs language-javascript">',
          '<span class="code-line numbered-code-line" data-line-number="1">',
          '<span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
          "</span>",
        ].join(""),
        [
          '<span class="code-line numbered-code-line" data-line-number="2">',
          '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>',
          '(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)',
          "</span></code></pre>",
        ].join(""),
      ].join("\n"),
    );
  });

  it("should not highlight (`no-highlight`), but add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(
        [
          '<pre><code class="no-highlight">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        [
          '<pre><code class="no-highlight">',
          '<span class="code-line numbered-code-line" data-line-number="1">',
          'var name = "World";',
          "</span>",
        ].join(""),
        [
          '<span class="code-line numbered-code-line" data-line-number="2">',
          'console.log("Hello, " + name + "!")',
          "</span></code></pre>",
        ].join(""),
      ].join("\n"),
    );
  });

  it("should prefer `no-highlight` over a `language-*` class, but add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process('<pre><code class="lang-js no-highlight">alert(1)</code></pre>');

    expect(String(file)).toEqual(
      [
        '<pre><code class="lang-js no-highlight">',
        '<span class="code-line numbered-code-line" data-line-number="1">',
        "alert(1)",
        "</span></code></pre>",
      ].join(""),
    );
  });

  it("should not highlight (`nohighlight`), and add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(
        [
          '<pre><code class="nohighlight">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        [
          '<pre><code class="nohighlight">',
          '<span class="code-line numbered-code-line" data-line-number="1">',
          'var name = "World";',
          "</span>",
        ].join(""),
        [
          '<span class="code-line numbered-code-line" data-line-number="2">',
          'console.log("Hello, " + name + "!")',
          "</span></code></pre>",
        ].join(""),
      ].join("\n"),
    );
  });

  it("should warn on missing languages, but add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(
        [
          '<pre><code class="lang-foobar">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(file.messages.map(String)).toEqual([
      "1:6-2:43: Cannot highlight as `foobar`, it’s not registered",
    ]);

    expect(String(file)).toEqual(
      [
        [
          '<pre><code class="hljs lang-foobar">',
          '<span class="code-line numbered-code-line" data-line-number="1">',
          'var name = "World";',
          "</span>",
        ].join(""),
        [
          '<span class="code-line numbered-code-line" data-line-number="2">',
          'console.log("Hello, " + name + "!")',
          "</span></code></pre>",
        ].join(""),
      ].join("\n"),
    );
  });

  it("should not highlight plainText-ed languages, but add line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { plainText: ["js"] })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(
        [
          '<pre><code class="lang-js">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        [
          '<pre><code class="lang-js">',
          '<span class="code-line numbered-code-line" data-line-number="1">',
          'var name = "World";',
          "</span>",
        ].join(""),
        [
          '<span class="code-line numbered-code-line" data-line-number="2">',
          'console.log("Hello, " + name + "!")',
          "</span></code></pre>",
        ].join(""),
      ].join("\n"),
    );
  });

  it("should not remove contents", async () => {
    // For some reason this isn’t detected as c++.
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true, subset: ["cpp"] })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(`<pre><code>def add(a, b):\n  return a + b</code></pre>`);

    expect(String(file)).toEqual(
      [
        [
          '<pre><code class="hljs">',
          '<span class="code-line numbered-code-line" data-line-number="1">',
          "def add(a, b):",
          "</span>",
        ].join(""),
        [
          '<span class="code-line numbered-code-line" data-line-number="2">',
          "  return a + b",
          "</span></code></pre>",
        ].join(""),
      ].join("\n"),
    );
  });

  it("should support multiple `code`s in a `pre`, and line numbering", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify).process(`<pre>
  <code class="language-javascript">const a = 1;</code>
  <code class="language-python">printf("x")</code>
</pre>`);

    expect(String(file)).toEqual(
      [
        [
          '<pre>  <code class="hljs language-javascript">',
          '<span class="code-line numbered-code-line" data-line-number="1">',
          '<span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>;',
          "</span></code>",
        ].join(""),
        [
          '  <code class="hljs language-python">',
          '<span class="code-line numbered-code-line" data-line-number="1">',
          'printf(<span class="hljs-string">"x"</span>)',
          "</span></code>",
        ].join(""),
        "</pre>",
      ].join("\n"),
    );
  });

  it("should reprocess exact", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(
        [
          [
            '<pre><code class="hljs lang-js">',
            '<span class="code-line numbered-code-line" data-line-number="1">',
            '<span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
            "</span>",
          ].join(""),
          [
            '<span class="code-line numbered-code-line" data-line-number="2">',
            '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)',
            "</span></code></pre>",
          ].join(""),
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        [
          '<pre><code class="hljs lang-js">',
          '<span class="code-line numbered-code-line" data-line-number="1">',
          '<span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
          "</span>",
        ].join(""),
        [
          '<span class="code-line numbered-code-line" data-line-number="2">',
          '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)',
          "</span></code></pre>",
        ].join(""),
      ].join("\n"),
    );
  });

  it("should parse custom language", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, {
        aliases: { javascript: ["funkyscript"] },
      })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process('<pre><code class="lang-funkyscript">console.log(1)</code></pre>');

    expect(String(file)).toEqual(
      [
        '<pre><code class="hljs lang-funkyscript">',
        '<span class="code-line numbered-code-line" data-line-number="1">',
        '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-number">1</span>)',
        "</span></code></pre>",
      ].join(""),
    );
  });

  it("should ignore comments", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { detect: true })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process('<pre><code><!--TODO-->"use strict";</code></pre>');

    expect(String(file)).toEqual(
      [
        '<pre><code class="hljs language-javascript">',
        '<span class="code-line numbered-code-line" data-line-number="1">',
        '<span class="hljs-meta">"use strict"</span>;',
        "</span></code></pre>",
      ].join(""),
    );
  });

  it("should support `<br>` elements", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process(
        '<pre><code class="language-javascript">"use strict";<br>console.log("very strict")</code></pre>',
      );

    expect(String(file)).toEqual(
      [
        [
          '<pre><code class="hljs language-javascript">',
          '<span class="code-line numbered-code-line" data-line-number="1">',
          '<span class="hljs-meta">"use strict"</span>;',
          "</span>",
        ].join(""),
        [
          '<span class="code-line numbered-code-line" data-line-number="2">',
          '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"very strict"</span>)',
          "</span></code></pre>",
        ].join(""),
      ].join("\n"),
    );
  });

  it("should register languages", async () => {
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight, { languages: { ...common, test: testLang } })
      .use(plugin, { showLineNumbers: true })
      .use(rehypeStringify)
      .process('<pre><code class="language-scss">test normal text</code></pre>');

    expect(String(file)).toEqual(
      [
        '<pre><code class="hljs language-scss">',
        '<span class="code-line numbered-code-line" data-line-number="1">',
        'test <span class="hljs-attribute">normal</span> <span class="hljs-selector-tag">text</span>',
        "</span></code></pre>",
      ].join(""),
    );
  });
});
