### [Become a sponsor](https://github.com/sponsors/ipikuka) 🚀

If you find **`rehype-highlight-code-lines`** useful in your projects, consider supporting my work.  
Your sponsorship means a lot 💖

Be the **first sponsor** and get featured here and on [my sponsor wall](https://github.com/sponsors/ipikuka).  
Thank you for supporting open source! 🙌

# rehype-highlight-code-lines

[![npm version][badge-npm-version]][url-npm-package]
[![npm downloads][badge-npm-download]][url-npm-package]
[![publish to npm][badge-publish-to-npm]][url-publish-github-actions]
[![code-coverage][badge-codecov]][url-codecov]
[![type-coverage][badge-type-coverage]][url-github-package]
[![typescript][badge-typescript]][url-typescript]
[![license][badge-license]][url-license]

This package is a **[unified][unified]** (**[rehype][rehype]**) plugin that **wraps each line of code in a container, enabling code block numbering and line highlighting**.

**[unified][unified]** is a project that transforms content with abstract syntax trees (ASTs) using the new parser **[micromark][micromark]**. **[remark][remark]** adds support for markdown to unified. **[mdast][mdast]** is the Markdown Abstract Syntax Tree (AST) which is a specification for representing markdown in a syntax tree. **[rehype][rehype]** is a tool that transforms HTML with plugins. **[hast][hast]** stands for HTML Abstract Syntax Tree (HAST) that rehype uses.

**This plugin enables line numbering for code blocks and highlights specific lines as needed.**

## When should I use this?

**`rehype-highlight-code-lines`** is ideal for adding line numbers to code blocks and highlighting specific lines.

**`rehype-highlight-code-lines`** is **NOT** code highlighter and **does NOT** provide code highlighting! You can use a code highlighter for example **[rehype-highlight][rehype-highlight]** to highlight the code, then use the `rehype-highlight-code-lines` **after**.

> [!IMPORTANT]
> If your code highlighter already provides numbering and highlighting code lines, don't use **`rehype-highlight-code-lines`**!
> \
> \
> You can use **`rehype-highlight-code-lines`** even without a code highlighter.

## Installation

This package is suitable for ESM only. In Node.js (version 16+), install with npm:

```bash
npm install rehype-highlight-code-lines
```

or

```bash
yarn add rehype-highlight-code-lines
```

## Usage

In a code fence, right after the language of the code block:
+ Use curly braces `{}` to specify a range of line numbers to highlight specific lines.
+ Add `showLineNumbers` to enable line numbering.

**\`\`\`[language] {2,4-6} showLineNumbers**

**\`\`\`[language] showLineNumbers {2}**

**\`\`\`[language] {1-3}**

**\`\`\`[language] showLineNumbers**

You can use the specifiers without a language:

**\`\`\`{5} showLineNumbers**

**\`\`\`showLineNumbers {5}**

**\`\`\`{2,3}**

**\`\`\`showLineNumbers**

Say we have the following markdown file, `example.md`:

````markdown
```javascript {2} showLineNumbers
let a1;
let a2;
let a3;
```
````

I assume you use `rehype-highlight` for code highlighting. Our module, `example.js`, looks as follows:

```javascript
import { read } from "to-vfile";
import remark from "remark";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeHighlightLines from "rehype-highlight-code-lines";
import rehypeStringify from "rehype-stringify";

main();

async function main() {
  const file = await remark()
    .use(gfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeHighlightLines)
    .use(rehypeStringify)
    .process(await read("example.md"));

  console.log(String(file));
}
```

Now, running `node example.js` you will see that each line of code is wrapped in a **`span`**, which has appropriate class names (`code-line`, `numbered-code-line`, `highlighted-code-line`)  and line numbering attribute `data-line-number`.

```html
<pre>
  <code class="hljs language-javascript">
    <span class="code-line numbered-code-line" data-line-number="1">
      <span class="hljs-keyword">let</span> a1;
    </span>
    <span
      class="code-line numbered-code-line highlighted-code-line" data-line-number="2">
      <span class="hljs-keyword">let</span> a2;
    </span>
    <span class="code-line numbered-code-line" data-line-number="3">
      <span class="hljs-keyword">let</span> a3;
    </span>
  </code>
</pre>
```

Without **`rehype-highlight-code-lines`**, the lines of code wouldn't be in a `span`.

```html
<pre>
  <code class="hljs language-javascript">
    <span class="hljs-keyword">let</span> a1;
    <span class="hljs-keyword">let</span> a2;
    <span class="hljs-keyword">let</span> a3;
  </code>
</pre>
```

***Note:** `hljs` prefix comes from `rehype-highlight`*.

## Usage in HTML attributes

**`rehype-highlight-code-lines`** runs on `<code>` elements with directives like `showLineNumbers` and range number in curly braces like `{2-4,8}`. That directives can be passed as a word in markdown (` ```ts showLineNumbers {2-4,8} `) or as a class and attribute in HTML (`<code class="language-ts show-line-numbers" data-highlight-lines="2-4,8">`).

The inverse occurs when the option `showLineNumbers` is true. All `<code>` are processed and numbered. Then (` ```ts noLineNumbers `), or as a class (`<code class="language-ts no-line-numbers">`) can be used to prevent processing.

**The class directives can be with dash or without, or camel cased.**

See some example usage as HTML class and attributes *(only opening `<code>` tags are provided, the rest is  omitted.)*:
```html
<code class="language-typescript show-line-numbers">
<code class="language-typescript showlinenumbers">
<code class="language-typescript showLineNumbers">

<code class="language-typescript show-line-numbers" data-highlight-lines="2-4">
<code class="language-typescript show-line-numbers" data-start-numbering="11">
<code class="language-typescript show-line-numbers" data-start-numbering="11" data-highlight-lines="2-4">

<code class="language-typescript no-line-numbers">
<code class="language-typescript nolinenumbers">
<code class="language-typescript noLineNumbers">
<code class="language-typescript no-line-numbers" data-highlight-lines="2-4">

<code class="no-line-numbers">
<code class="show-line-numbers">
<code class="show-line-numbers" data-highlight-lines="2-4">
<code data-highlight-lines="2-4">
<code data-start-numbering="11">
```

Say we have the following HTML fragment in a `example.md`:

```markdown
<pre><code class="language-javascript show-line-numbers" data-highlight-lines="2">
let a1;
let a2;
let a3;
</code></pre>
```

I assume you use `rehype-highlight` for code highlighting. Our module, `example.js`, looks as follows:

```javascript
import { read } from "to-vfile";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeHighlightLines from "rehype-highlight-code-lines";
import rehypeStringify from "rehype-stringify";

main();

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight)
    .use(rehypeHighlightLines)
    .use(rehypeStringify)
    .process(await read("example.md"));

  console.log(String(file));
}
```

Now, running `node example.js` you will see that each line of code is wrapped in a **`span`**, which has appropriate class names (`code-line`, `numbered-code-line`, `highlighted-code-line`)  and line numbering attribute `data-line-number`.

```html
<pre>
  <code class="hljs language-javascript">
    <span class="code-line numbered-code-line" data-line-number="1">
      <span class="hljs-keyword">let</span> a1;
    </span>
    <span
      class="code-line numbered-code-line highlighted-code-line" data-line-number="2">
      <span class="hljs-keyword">let</span> a2;
    </span>
    <span class="code-line numbered-code-line" data-line-number="3">
      <span class="hljs-keyword">let</span> a3;
    </span>
  </code>
</pre>
```

## Options

All options are **optional** and have **default values**.

```typescript
type HighlightLinesOptions = {
  showLineNumbers?: boolean; // default is "false"
  keepOuterBlankLine?: boolean; // default is "false"
};

use(rehypeHighlightLines, HighlightLinesOptions);
```

#### `showLineNumbers`

It is a **boolean** option which is for all code to be numbered.

By default, it is `false`.

```javascript
use(rehypeHighlightLines, {
  showLineNumbers: true,
});
```

Now, all code blocks will become numbered.

If you want to exclude a specific code block not to be numbered, use `noLineNumbers`.

**\`\`\`[language] noLineNumbers {2}**

**\`\`\`[language] noLineNumbers**

**\`\`\`noLineNumbers**

If you want to exclude a specific code block not to be numbered in HTML fragment (in `<pre>`) use `no-line-numbers` class. In that case, the directive could be with dash, or without, or camel cased.

**`<code class="language-ts no-line-numbers">`**

**`<code class="language-ts nolinenumbers">`**

**`<code class="language-ts noLineNumbers">`**

Sometimes you may want to start the line numbering from a specific number. In that cases, use `showLineNumbers=[number]` in code blocks. For example, below, the code block's line numbering will start from number `8`. 

**\`\`\`[language] {2} showLineNumbers=8**

**\`\`\`[language] showLineNumbers=8**

**\`\`\`showLineNumbers=8**

If you want to start the line numbering from a specific number in HTML fragment (in `<pre>`) use `data-start-numbering` attribute.

**`<code class="..." data-start-numbering="8">`**

#### `keepOuterBlankLine`

It is a **boolean** option which is for all code blocks have an empty line container in the beginning and at the end. I added this option in case you want to have an empty code line on the edges for whatever reason.

By default, it is `false`.

```javascript
use(rehypeHighlightLines, {
  keepOuterBlankLine: true,
});
```

Now, all code blocks will have one empty code line on each edge.

If you want a specific code block has empty code line on the edges, use `keepOuterBlankLine`.

**\`\`\`[language] keepOuterBlankLine**

**\`\`\`keepOuterBlankLine**

In HTML fragment use `keep-outer-blank-line` class. In that case, the directive could be with dash, or without, or camel cased.

**`<code class="language-ts keep-outer-blank-line">`**

**`<code class="language-ts keepouterblankline">`**

**`<code class="language-ts keepOuterBlankLine">`**

### Examples:

```typescript
// line numbering will occur as per directive "showLineNumber" and code-line containers will be <span> inline element
use(rehypeHighlightLines);

// all code blocks will be numbered by default and code-line containers will be <span> inline element
use(rehypeHighlightLines, {
  showLineNumbers: true,
});
```

**An example screen snapshot from a working app:**

![markdown code block input](https://github.com/rehypejs/rehype-highlight/assets/30029208/d597f4e5-d7ca-4a84-b843-950094e4a49b)
![markdown code block result](https://github.com/rehypejs/rehype-highlight/assets/30029208/908449d6-8028-4ecd-8536-3e747c725da7)

**Here you can find some demo applications below which the `rehype-highlight` and `rehype-highlight-code-lines` are used together:**
+ [demo blog application](https://next-mdx-remote-client-in-app-router.vercel.app/) using `next-mdx-remote-client` within `Next.js app router`
+ [demo blog application](https://next-mdx-remote-client-in-pages-router.vercel.app/) using `next-mdx-remote-client` within `Next.js pages router`

## Styling

The following styles can be added for **line highlighting** and **line numbering** to work correctly:

*Choose the colors as you wish!*

```css
.parent-container-of-pre {
  display: grid; /* in order { overflow-x: auto; } works in child <pre> */
}

pre,
pre code {
  background-color: var(--color-code-background);

  direction: ltr;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  line-height: 1.2;
  tab-size: 2;
  hyphens: none;
}

pre {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-text-weak);
  border-radius: 5px;

  overflow-x: auto;
}

pre > code {
  float: left;
  min-width: 100%;
}

.code-line {
  min-width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  margin-left: -12px;
  margin-right: -12px;
  border-left: 4px solid transparent; /* prepare for highlighted code-lines */

  display: inline-block;
}

.code-line.inserted {
  background-color: var(--color-inserted-line); /* inserted code-line (+) */
}

.code-line.deleted {
  background-color: var(--color-deleted-line); /* deleted code-line (-) */
}

.highlighted-code-line {
  background-color: var(--color-highlighted-line);
  border-left: 4px solid var(--color-highlighted-line-indicator);
}

.numbered-code-line::before {
  content: attr(data-line-number);

  margin-left: -8px;
  margin-right: 16px;
  width: 1rem;
  color: var(--color-text-weak);
  text-align: right;

  display: inline-block;
}
```

## Syntax tree

This plugin modifies the `hast` (HTML abstract syntax tree).

## Types

This package is fully typed with [TypeScript][url-typescript].

The plugin exports the type `HighlightLinesOptions`.

## Compatibility

This plugin works with `rehype-parse` version 1+, `rehype-stringify` version 1+, `rehype` version 1+, and unified version `4+`.

## Security

Use of **`rehype-highlight-code-lines`** involves rehype (hast), but doesn't lead to cross-site scripting (XSS) attacks.

## My Plugins

I like to contribute the Unified / Remark / MDX ecosystem, so I recommend you to have a look my plugins.

### My Remark Plugins

- [`remark-flexible-code-titles`](https://www.npmjs.com/package/remark-flexible-code-titles)
  – Remark plugin to add titles or/and containers for the code blocks with customizable properties
- [`remark-flexible-containers`](https://www.npmjs.com/package/remark-flexible-containers)
  – Remark plugin to add custom containers with customizable properties in markdown
- [`remark-ins`](https://www.npmjs.com/package/remark-ins)
  – Remark plugin to add `ins` element in markdown
- [`remark-flexible-paragraphs`](https://www.npmjs.com/package/remark-flexible-paragraphs)
  – Remark plugin to add custom paragraphs with customizable properties in markdown
- [`remark-flexible-markers`](https://www.npmjs.com/package/remark-flexible-markers)
  – Remark plugin to add custom `mark` element with customizable properties in markdown
- [`remark-flexible-toc`](https://www.npmjs.com/package/remark-flexible-toc)
  – Remark plugin to expose the table of contents via `vfile.data` or via an option reference
- [`remark-mdx-remove-esm`](https://www.npmjs.com/package/remark-mdx-remove-esm)
  – Remark plugin to remove import and/or export statements (mdxjsEsm)

### My Rehype Plugins

- [`rehype-pre-language`](https://www.npmjs.com/package/rehype-pre-language)
  – Rehype plugin to add language information as a property to `pre` element
- [`rehype-highlight-code-lines`](https://www.npmjs.com/package/rehype-highlight-code-lines)
  – Rehype plugin to add line numbers to code blocks and allow highlighting of desired code lines
- [`rehype-code-meta`](https://www.npmjs.com/package/rehype-code-meta)
  – Rehype plugin to copy `code.data.meta` to `code.properties.metastring`
- [`rehype-image-toolkit`](https://www.npmjs.com/package/rehype-image-toolkit)
  – Rehype plugin to enhance Markdown image syntax `![]()` and Markdown/MDX media elements (`<img>`, `<audio>`, `<video>`) by auto-linking bracketed or parenthesized image URLs, wrapping them in `<figure>` with optional captions, unwrapping images/videos/audio from paragraph, parsing directives in title for styling and adding attributes, and dynamically converting images into `<video>` or `<audio>` elements based on file extension.

### My Recma Plugins

- [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided so as not to throw an error
- [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the `props` parameter into the `_props` in the `function _createMdxContent(props) {/* */}` in the compiled source in order to be able to use `{props.foo}` like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.
- [`recma-mdx-change-imports`](https://www.npmjs.com/package/recma-mdx-change-imports)
  – Recma plugin to convert import declarations for assets and media with relative links into variable declarations with string URLs, enabling direct asset URL resolution in compiled MDX.
- [`recma-mdx-import-media`](https://www.npmjs.com/package/recma-mdx-import-media)
  – Recma plugin to turn media relative paths into import declarations for both markdown and html syntax in MDX.
- [`recma-mdx-import-react`](https://www.npmjs.com/package/recma-mdx-import-react)
  – Recma plugin to ensure getting `React` instance from the arguments and to make the runtime props `{React, jsx, jsxs, jsxDev, Fragment}` is available in the dynamically imported components in the compiled source of MDX.
- [`recma-mdx-html-override`](https://www.npmjs.com/package/recma-mdx-html-override)
  – Recma plugin to allow selected raw HTML elements to be overridden via MDX components.
- [`recma-mdx-interpolate`](https://www.npmjs.com/package/recma-mdx-interpolate)
  – Recma plugin to enable interpolation of identifiers wrapped in curly braces within the `alt`, `src`, `href`, and `title` attributes of markdown link and image syntax in MDX.

## License

[MIT License](./LICENSE) © ipikuka

[unified]: https://github.com/unifiedjs/unified
[micromark]: https://github.com/micromark/micromark
[remark]: https://github.com/remarkjs/remark
[remarkplugins]: https://github.com/remarkjs/remark/blob/main/doc/plugins.md
[mdast]: https://github.com/syntax-tree/mdast
[rehype]: https://github.com/rehypejs/rehype
[rehypeplugins]: https://github.com/rehypejs/rehype/blob/main/doc/plugins.md
[hast]: https://github.com/syntax-tree/hast
[rehype-highlight]: https://github.com/rehypejs/rehype-highlight

[badge-npm-version]: https://img.shields.io/npm/v/rehype-highlight-code-lines
[badge-npm-download]:https://img.shields.io/npm/dt/rehype-highlight-code-lines
[url-npm-package]: https://www.npmjs.com/package/rehype-highlight-code-lines
[url-github-package]: https://github.com/ipikuka/rehype-highlight-code-lines

[badge-license]: https://img.shields.io/github/license/ipikuka/rehype-highlight-code-lines
[url-license]: https://github.com/ipikuka/rehype-highlight-code-lines/blob/main/LICENSE

[badge-publish-to-npm]: https://github.com/ipikuka/rehype-highlight-code-lines/actions/workflows/publish.yml/badge.svg
[url-publish-github-actions]: https://github.com/ipikuka/rehype-highlight-code-lines/actions/workflows/publish.yml

[badge-typescript]: https://img.shields.io/npm/types/rehype-highlight-code-lines
[url-typescript]: https://www.typescriptlang.org

[badge-codecov]: https://codecov.io/gh/ipikuka/rehype-highlight-code-lines/graph/badge.svg?token=RKrZlvMHwq
[url-codecov]: https://codecov.io/gh/ipikuka/rehype-highlight-code-lines

[badge-type-coverage]: https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fipikuka%2Frehype-highlight-code-lines%2Fmain%2Fpackage.json