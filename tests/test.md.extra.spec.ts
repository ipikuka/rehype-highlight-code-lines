import { describe, it, expect } from "vitest";
import dedent from "dedent";

import { processFromMd } from "./util/index";
import "./util/test-utils";

describe("reyhpe-highlight-code-lines, with extra blank lines", () => {
  // ******************************************
  it("inside extra blank lines - 11", async () => {
    const input = dedent`
      \`\`\`javascript

      "use strict";
      
      console.log("xxx");

      \`\`\`
    `;

    const html1 = String(await processFromMd(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="hljs-meta">
      "use strict"</span>;

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);

      </code></pre>"
    `);

    const html2 = String(
      await processFromMd(input, { showLineNumbers: true, keepOuterBlankLine: true }),
    );

    expect(html2).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-meta">"use strict"</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="3"></span>
      <span class="code-line numbered-code-line" data-line-number="4"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="5"></span>
      </code></pre>"
    `);

    const html3 = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html3).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-meta">"use strict"</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="2"></span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);</span>
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

    const html1 = String(await processFromMd(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="hljs-meta">

      "use strict"</span>;

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);


      </code></pre>"
    `);

    const html2 = String(
      await processFromMd(input, { showLineNumbers: true, keepOuterBlankLine: true }),
    );

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

    const html3 = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html3).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-meta">"use strict"</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="3"></span>
      <span class="code-line numbered-code-line" data-line-number="4"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="5"></span>
      </code></pre>"
    `);
  });

  // ******************************************
  it("inside extra blank lines (keepOuterBlankLine in directive) - 13", async () => {
    const input = dedent`
      \`\`\`javascript keepOuterBlankLine

      "use strict";

      console.log("xxx");

      \`\`\`
    `;

    const html1 = String(await processFromMd(input));

    // only keepOuterBlankLine is effectless
    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="hljs-meta">
      "use strict"</span>;

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);

      </code></pre>"
    `);

    const html2 = String(await processFromMd(input, { showLineNumbers: true }));

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
  it("inside extra blank lines - 21", async () => {
    const input = dedent`
      \`\`\`javascript

      console.log("xxx");

      let a = 1;
      
      \`\`\`
    `;

    const html1 = String(await processFromMd(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);

      <span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;

      </code></pre>"
    `);

    const html2 = String(
      await processFromMd(input, { showLineNumbers: true, keepOuterBlankLine: true }),
    );

    expect(html2).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="3"></span>
      <span class="code-line numbered-code-line" data-line-number="4"><span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="5"></span>
      </code></pre>"
    `);

    const html3 = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html3).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="2"></span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;</span>
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

    const html1 = String(await processFromMd(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">

      <span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);


      </code></pre>"
    `);

    const html2 = String(
      await processFromMd(input, { showLineNumbers: true, keepOuterBlankLine: true }),
    );

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

    const html3 = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html3).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="3"></span>
      <span class="code-line numbered-code-line" data-line-number="4"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="5"></span>
      </code></pre>"
    `);
  });

  // ******************************************
  it("inside extra blank lines (keepOuterBlankLine in directive) - 23", async () => {
    const input = dedent`
      \`\`\`javascript keepOuterBlankLine

      console.log("xxx");

      let a = 1;
      
      \`\`\`
    `;

    const html1 = String(await processFromMd(input));

    // only keepOuterBlankLine is effectless
    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);

      <span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;

      </code></pre>"
    `);

    const html2 = String(await processFromMd(input, { showLineNumbers: true }));

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
  it("inside extra blank lines - 31, double comments", async () => {
    const input = dedent`
      \`\`\`javascript

      // comment 1
      // comment 2

      let a = 1;
      
      \`\`\`
    `;

    const html1 = String(await processFromMd(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">
      <span class="hljs-comment">// comment 1</span>
      <span class="hljs-comment">// comment 2</span>

      <span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;

      </code></pre>"
    `);

    const html2 = String(
      await processFromMd(input, { showLineNumbers: true, keepOuterBlankLine: true }),
    );

    expect(html2).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-comment">// comment 1</span></span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-comment">// comment 2</span></span>
      <span class="code-line numbered-code-line" data-line-number="4"></span>
      <span class="code-line numbered-code-line" data-line-number="5"><span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;</span>
      <span class="code-line numbered-code-line" data-line-number="6"></span>
      </code></pre>"
    `);

    const html3 = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html3).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-comment">// comment 1</span></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-comment">// comment 2</span></span>
      <span class="code-line numbered-code-line" data-line-number="3"></span>
      <span class="code-line numbered-code-line" data-line-number="4"><span class="hljs-keyword">let</span> a = <span class="hljs-number">1</span>;</span>
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

    const html1 = String(await processFromMd(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">

      <span class="hljs-comment">/**
       * comment1
       */</span>

      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);


      </code></pre>"
    `);

    const html2 = String(
      await processFromMd(input, { showLineNumbers: true, keepOuterBlankLine: true }),
    );

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

    const html3 = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html3).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-comment">/**</span></span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-comment"> * comment1</span></span>
      <span class="code-line numbered-code-line" data-line-number="4"><span class="hljs-comment"> */</span></span>
      <span class="code-line numbered-code-line" data-line-number="5"></span>
      <span class="code-line numbered-code-line" data-line-number="6"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"xxx"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="7"></span>
      </code></pre>"
    `);
  });

  // ******************************************
  it("inside extra blank lines - 41, multiline comment in python", async () => {
    const input = dedent`
      \`\`\`python
      def multiply_numbers(x, y):
        """
        Multiplies two numbers and returns the product.

        Args:
          x (float): The first number.
          y (float): The second number.

        Returns:
          float: The product of x and y.
        """
        return x * y

      # Example usage:
      product = multiply_numbers(4, 7)
      print("The product is:", product)
      \`\`\`
    `;

    const html1 = String(await processFromMd(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">multiply_numbers</span>(<span class="hljs-params">x, y</span>):
        <span class="hljs-string">"""
        Multiplies two numbers and returns the product.

        Args:
          x (float): The first number.
          y (float): The second number.

        Returns:
          float: The product of x and y.
        """</span>
        <span class="hljs-keyword">return</span> x * y

      <span class="hljs-comment"># Example usage:</span>
      product = multiply_numbers(<span class="hljs-number">4</span>, <span class="hljs-number">7</span>)
      <span class="hljs-built_in">print</span>(<span class="hljs-string">"The product is:"</span>, product)
      </code></pre>"
    `);

    const html2 = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html2).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-python"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">def</span> <span class="hljs-title function_">multiply_numbers</span>(<span class="hljs-params">x, y</span>):</span>
      <span class="code-line numbered-code-line" data-line-number="2">  <span class="hljs-string">"""</span></span>
      <span class="code-line numbered-code-line" data-line-number="3"><span class="hljs-string">  Multiplies two numbers and returns the product.</span></span>
      <span class="code-line numbered-code-line" data-line-number="4"><span class="hljs-string"></span></span>
      <span class="code-line numbered-code-line" data-line-number="5"><span class="hljs-string">  Args:</span></span>
      <span class="code-line numbered-code-line" data-line-number="6"><span class="hljs-string">    x (float): The first number.</span></span>
      <span class="code-line numbered-code-line" data-line-number="7"><span class="hljs-string">    y (float): The second number.</span></span>
      <span class="code-line numbered-code-line" data-line-number="8"><span class="hljs-string"></span></span>
      <span class="code-line numbered-code-line" data-line-number="9"><span class="hljs-string">  Returns:</span></span>
      <span class="code-line numbered-code-line" data-line-number="10"><span class="hljs-string">    float: The product of x and y.</span></span>
      <span class="code-line numbered-code-line" data-line-number="11"><span class="hljs-string">  """</span></span>
      <span class="code-line numbered-code-line" data-line-number="12">  <span class="hljs-keyword">return</span> x * y</span>
      <span class="code-line numbered-code-line" data-line-number="13"></span>
      <span class="code-line numbered-code-line" data-line-number="14"><span class="hljs-comment"># Example usage:</span></span>
      <span class="code-line numbered-code-line" data-line-number="15">product = multiply_numbers(<span class="hljs-number">4</span>, <span class="hljs-number">7</span>)</span>
      <span class="code-line numbered-code-line" data-line-number="16"><span class="hljs-built_in">print</span>(<span class="hljs-string">"The product is:"</span>, product)</span>
      </code></pre>"
    `);
  });

  // ******************************************
  it("inside extra blank lines - 42, javascript function", async () => {
    const input = dedent`
      \`\`\`javascript
      
      async function highlight (code) {
        "use server"
      
        console.log("next-mdx-remote-client");
      }
      
      \`\`\`
    `;

    const html1 = String(await processFromMd(input));

    expect(html1).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript">
      <span class="hljs-keyword">async</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">highlight</span> (<span class="hljs-params">code</span>) {
        <span class="hljs-string">"use server"</span>

        <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"next-mdx-remote-client"</span>);
      }

      </code></pre>"
    `);

    const html2 = String(
      await processFromMd(input, { showLineNumbers: true, keepOuterBlankLine: true }),
    );

    expect(html2).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"></span>
      <span class="code-line numbered-code-line" data-line-number="2"><span class="hljs-keyword">async</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">highlight</span> (<span class="hljs-params">code</span>) {</span>
      <span class="code-line numbered-code-line" data-line-number="3">  <span class="hljs-string">"use server"</span></span>
      <span class="code-line numbered-code-line" data-line-number="4"></span>
      <span class="code-line numbered-code-line" data-line-number="5">  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"next-mdx-remote-client"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="6">}</span>
      <span class="code-line numbered-code-line" data-line-number="7"></span>
      </code></pre>"
    `);

    const html3 = String(await processFromMd(input, { showLineNumbers: true }));

    expect(html3).toMatchInlineSnapshot(`
      "<pre><code class="hljs language-javascript"><span class="code-line numbered-code-line" data-line-number="1"><span class="hljs-keyword">async</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">highlight</span> (<span class="hljs-params">code</span>) {</span>
      <span class="code-line numbered-code-line" data-line-number="2">  <span class="hljs-string">"use server"</span></span>
      <span class="code-line numbered-code-line" data-line-number="3"></span>
      <span class="code-line numbered-code-line" data-line-number="4">  <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">"next-mdx-remote-client"</span>);</span>
      <span class="code-line numbered-code-line" data-line-number="5">}</span>
      </code></pre>"
    `);
  });
});
