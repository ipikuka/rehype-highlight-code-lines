import { describe, it, expect } from "vitest";

import { common, type LanguageFn } from "lowlight";
import { rehype } from "rehype";
import rehypeHighlight from "rehype-highlight";

// all the test is taken from `rehype-highlight` for reference
describe("reyhpe-highlight-code-lines", () => {
  const testLang: LanguageFn = function () {
    return {
      aliases: ["test"],
      contains: [],
      keywords: { keyword: "test" },
    };
  };

  it("should expose the public api", async () => {
    expect(Object.keys(await import("rehype-highlight")).sort()).toEqual(["default"]);
  });

  it("should work on empty code", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight, { detect: true })
      .process(["<h1>Hello World!</h1>", "", "<pre><code></code></pre>"].join("\n"));

    expect(String(file)).toEqual(
      ["<h1>Hello World!</h1>", "", '<pre><code class="hljs"></code></pre>'].join("\n"),
    );
  });

  it("should not highlight (no class)", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .process(
        ["<h1>Hello World!</h1>", "", '<pre><code>"use strict";</code></pre>'].join("\n"),
      );

    expect(String(file)).toEqual(
      ["<h1>Hello World!</h1>", "", '<pre><code>"use strict";</code></pre>'].join("\n"),
    );
  });

  it("should highlight (`detect`, no class)", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight, { detect: true })
      .process(
        ["<h1>Hello World!</h1>", "", '<pre><code>"use strict";</code></pre>'].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>;</code></pre>',
      ].join("\n"),
    );
  });

  it("should highlight (detect, no class, subset)", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight, { detect: true, subset: ["arduino"] })
      .process(
        ["<h1>Hello World!</h1>", "", '<pre><code>"use strict";</code></pre>'].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="hljs language-arduino"><span class="hljs-string">"use strict"</span>;</code></pre>',
      ].join("\n"),
    );
  });

  it("should not highlight (`detect: false`, no class)", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight, { detect: false })
      .process(
        ["<h1>Hello World!</h1>", "", '<pre><code>"use strict";</code></pre>'].join("\n"),
      );

    expect(String(file)).toEqual(
      ["<h1>Hello World!</h1>", "", '<pre><code>"use strict";</code></pre>'].join("\n"),
    );
  });

  it("should highlight (prefix without dash)", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight, { detect: true, prefix: "foo" })
      .process(
        ["<h1>Hello World!</h1>", "", '<pre><code>"use strict";</code></pre>'].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="foo language-javascript"><span class="foometa">"use strict"</span>;</code></pre>',
      ].join("\n"),
    );
  });

  it("should highlight (prefix with dash)", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight, { detect: true, prefix: "foo-" })
      .process(
        ["<h1>Hello World!</h1>", "", '<pre><code>"use strict";</code></pre>'].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="foo language-javascript"><span class="foo-meta">"use strict"</span>;</code></pre>',
      ].join("\n"),
    );
  });

  it("should highlight (lang class)", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .process(
        [
          "<h1>Hello World!</h1>",
          "",
          '<pre><code class="lang-js">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
        '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>',
      ].join("\n"),
    );
  });

  it("should highlight (language class)", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .process(
        [
          "<h1>Hello World!</h1>",
          "",
          '<pre><code class="language-js">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="hljs language-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
        '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>',
      ].join("\n"),
    );
  });

  it("should highlight (long name)", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .process(
        [
          "<h1>Hello World!</h1>",
          "",
          '<pre><code class="language-javascript">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="hljs language-javascript"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
        '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>',
      ].join("\n"),
    );
  });

  it("should not highlight (`no-highlight`)", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .process(
        [
          "<h1>Hello World!</h1>",
          "",
          '<pre><code class="no-highlight">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="no-highlight">var name = "World";',
        'console.log("Hello, " + name + "!")</code></pre>',
      ].join("\n"),
    );
  });

  it("should prefer `no-highlight` over a `language-*` class", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .process(
        '<h1>Hello World!</h1>\n<pre><code class="lang-js no-highlight">alert(1)</code></pre>',
      );

    expect(String(file)).toEqual(
      '<h1>Hello World!</h1>\n<pre><code class="lang-js no-highlight">alert(1)</code></pre>',
    );
  });

  it("should not highlight (`nohighlight`)", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .process(
        [
          "<h1>Hello World!</h1>",
          "",
          '<pre><code class="nohighlight">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="nohighlight">var name = "World";',
        'console.log("Hello, " + name + "!")</code></pre>',
      ].join("\n"),
    );
  });

  it("should warn on missing languages", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .process(
        [
          "<h1>Hello World!</h1>",
          "",
          '<pre><code class="lang-foobar">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(file.messages.map(String)).toEqual([
      "3:6-4:43: Cannot highlight as `foobar`, it’s not registered",
    ]);
  });

  it("should not highlight plainText-ed languages", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight, { plainText: ["js"] })
      .process(
        [
          "<h1>Hello World!</h1>",
          "",
          '<pre><code class="lang-js">var name = "World";',
          'console.log("Hello, " + name + "!")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="lang-js">var name = "World";',
        'console.log("Hello, " + name + "!")</code></pre>',
      ].join("\n"),
    );
  });

  it("should not remove contents", async () => {
    // For some reason this isn’t detected as c++.
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight, { detect: true, subset: ["cpp"] })
      .process(`<pre><code>def add(a, b):\n  return a + b</code></pre>`);

    expect(String(file)).toEqual(
      '<pre><code class="hljs">def add(a, b):\n  return a + b</code></pre>',
    );
  });

  it("should reprocess exact 1", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .process(
        [
          "<h1>Hello World!</h1>",
          "",
          '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
          '<span class="hljs-built_in">console</span>.log(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
        '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>',
      ].join("\n"),
    );
  });

  it("should parse custom language", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight, {
        aliases: { javascript: ["funkyscript"] },
      })
      .process('<pre><code class="lang-funkyscript">console.log(1)</code></pre>');

    expect(String(file)).toEqual(
      '<pre><code class="hljs lang-funkyscript"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-number">1</span>)</code></pre>',
    );
  });

  it("should reprocess exact 2", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .process(
        [
          "<h1>Hello World!</h1>",
          "",
          '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
          '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="hljs lang-js"><span class="hljs-keyword">var</span> name = <span class="hljs-string">"World"</span>;',
        '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"Hello, "</span> + name + <span class="hljs-string">"!"</span>)</code></pre>',
      ].join("\n"),
    );
  });

  it("should ignore comments", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight, { detect: true })
      .process(
        ["<h1>Hello World!</h1>", "", '<pre><code><!--TODO-->"use strict";</code></pre>'].join(
          "\n",
        ),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>;</code></pre>',
      ].join("\n"),
    );
  });

  it("should support `<br>` elements", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight)
      .process(
        [
          "<h1>Hello World!</h1>",
          "",
          '<pre><code class="language-javascript">"use strict";<br>console.log("very strict")</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="hljs language-javascript"><span class="hljs-meta">"use strict"</span>;',
        '<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"very strict"</span>)</code></pre>',
      ].join("\n"),
    );
  });

  it("should register languages", async () => {
    const file = await rehype()
      .data("settings", { fragment: true })
      .use(rehypeHighlight, { languages: { ...common, test: testLang } })
      .process(
        [
          "<h1>Hello World!</h1>",
          "",
          '<pre><code class="language-scss">test normal text</code></pre>',
        ].join("\n"),
      );

    expect(String(file)).toEqual(
      [
        "<h1>Hello World!</h1>",
        "",
        '<pre><code class="hljs language-scss">test <span class="hljs-attribute">normal</span> <span class="hljs-selector-tag">text</span></code></pre>',
      ].join("\n"),
    );
  });
});
