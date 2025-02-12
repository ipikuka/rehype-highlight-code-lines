import { describe, it, expect } from "vitest";

import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import dedent from "dedent";

import plugin from "../src";
import "./util/test-utils";

describe("pre code shouldn't produce blank lines", () => {
  it("shouldn't add empty code lines - 1", async () => {
    const html = dedent`
      <pre>
        <code class="language-javascript">
          let a;
        </code>
      </pre>
    `;

    // without `rehype-highlight-code-lines`
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(html);

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
          <span class="hljs-keyword">let</span> a;
        </code>
      </pre>"
    `);

    // with `rehype-highlight-code-lines`
    const file2 = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true, trimBlankLines: true })
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

  it("shouldn't add empty code lines - 2", async () => {
    const html = dedent`
      <pre>
        <code class="language-javascript">
      let a;
        </code>
      </pre>
    `;

    // without `rehype-highlight-code-lines`
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(html);

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
      <span class="hljs-keyword">let</span> a;
        </code>
      </pre>"
    `);

    // with `rehype-highlight-code-lines`
    const file2 = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true, trimBlankLines: true })
      .use(rehypeStringify)
      .process(html);

    expect(String(file2).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
      <span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">let</span> a;</span>
        </code>
      </pre>"
    `);
  });

  it("shouldn't add empty code lines - 3", async () => {
    const html = dedent`
      <pre><code class="language-javascript">
      let a;
      </code></pre>
    `;

    // without `rehype-highlight-code-lines`
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(html);

    expect(String(file)).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">
      <span class="hljs-keyword">let</span> a;
      </code></pre>"
    `);

    // with `rehype-highlight-code-lines`
    const file2 = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true, trimBlankLines: true })
      .use(rehypeStringify)
      .process(html);

    expect(String(file2)).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">
      <span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">let</span> a;</span>
      </code></pre>"
    `);
  });

  it("shouldn't add empty code lines - 4", async () => {
    const html = dedent`
      <pre>
        <code class="language-javascript">
          "use strict";
        </code>
      </pre>
    `;

    // without `rehype-highlight-code-lines`
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(html);

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript"><span class="hljs-meta">
          "use strict"</span>;
        </code>
      </pre>"
    `);

    // with `rehype-highlight-code-lines`
    const file2 = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true, trimBlankLines: true })
      .use(rehypeStringify)
      .process(html);

    expect(String(file2).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
      <span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-meta">    "use strict"</span>;</span>
        </code>
      </pre>"
    `);
  });

  it("shouldn't add empty code lines - 5", async () => {
    const html = dedent`
      <pre>
        <code class="language-javascript">
      "use strict";
        </code>
      </pre>
    `;

    // without `rehype-highlight-code-lines`
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(html);

    expect(String(file).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript"><span class="hljs-meta">
      "use strict"</span>;
        </code>
      </pre>"
    `);

    // with `rehype-highlight-code-lines`
    const file2 = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true, trimBlankLines: true })
      .use(rehypeStringify)
      .process(html);

    expect(String(file2).prettifyPre()).toMatchInlineSnapshot(`
      "<pre>
        <code class="hljs language-javascript">
      <span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-meta">"use strict"</span>;</span>
        </code>
      </pre>"
    `);
  });

  it("shouldn't add empty code lines - 6", async () => {
    const html = dedent`
      <pre><code class="language-javascript">
      "use strict";
      </code></pre>
    `;

    // without `rehype-highlight-code-lines`
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(html);

    expect(String(file)).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="hljs-meta">
      "use strict"</span>;
      </code></pre>"
    `);

    // with `rehype-highlight-code-lines`
    const file2 = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true, trimBlankLines: true })
      .use(rehypeStringify)
      .process(html);

    expect(String(file2)).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">
      <span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-meta">"use strict"</span>;</span>
      </code></pre>"
    `);
  });

  it("shouldn't add empty code lines - 7", async () => {
    const html = dedent`
      <pre><code class="language-javascript">
      /**
       * multiline comment
       */
      </code></pre>
    `;

    // without `rehype-highlight-code-lines`
    const file = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(html);

    expect(String(file)).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">
      <span class="hljs-comment">/**
       * multiline comment
       */</span>
      </code></pre>"
    `);

    // with `rehype-highlight-code-lines`
    const file2 = await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeHighlight)
      .use(plugin, { showLineNumbers: true, trimBlankLines: true })
      .use(rehypeStringify)
      .process(html);

    expect(String(file2)).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">
      <span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-comment">/**</span></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-comment"> * multiline comment</span></span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-comment"> */</span></span>
      </code></pre>"
    `);
  });
});
