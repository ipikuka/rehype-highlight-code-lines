# rehype-highlight-code-lines

[![NPM version][badge-npm-version]][npm-package-url]
[![NPM downloads][badge-npm-download]][npm-package-url]
[![Build][badge-build]][github-workflow-url]
[![codecov](https://codecov.io/gh/ipikuka/rehype-highlight-code-lines/graph/badge.svg?token=RKrZlvMHwq)](https://codecov.io/gh/ipikuka/rehype-highlight-code-lines)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fipikuka%2Frehype-highlight-code-lines%2Fmaster%2Fpackage.json)](https://github.com/ipikuka/rehype-highlight-code-lines)
[![typescript][badge-typescript]][typescript-url]
[![License][badge-license]][github-license-url]

This package is a [unified][unified] ([rehype][rehype]) plugin **to add container to each line in a code block, allowing numbering of the code block and highlighting desired lines of code**.

**[unified][unified]** is a project that transforms content with abstract syntax trees (ASTs) using the new parser **[micromark][micromark]**. **[remark][remark]** adds support for markdown to unified. **[mdast][mdast]** is the Markdown Abstract Syntax Tree (AST) which is a specification for representing markdown in a syntax tree. "**[rehype][rehype]**" is a tool that transforms HTML with plugins. "**[hast][hast]**" stands for HTML Abstract Syntax Tree (HAST) that rehype uses.

**This plugin allows adding line numbers to code blocks and highlighting of desired code lines.**

## When should I use this?

The `rehype-highlight-code-lines` is useful if you want to add line numbers to code blocks and want to highlight desired code lines.

**The `rehype-highlight-code-lines` is NOT code highlighter and does NOT provide code highlighting!** You can use a code highlighter for example **[rehype-highlight][rehype-highlight]** to highlight the code, then use the `rehype-highlight-code-lines` **after**. 

> [!IMPORTANT]
> If the code highlighter already provides numbering and highlighting code lines, don't use `rehype-highlight-code-lines`!
> \
> \
> You can use `rehype-highlight-code-lines` even without a code highlighter.

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

In a code fence, just after the language of the code block,
+ specify a range of number in curly braces in order to highlight desired code lines,
+ and/or add `showLineNumbers` in order to add numbering to code lines.

**\`\`\`[language] {2,4-6} showLineNumbers**

**\`\`\`[language] showLineNumbers {2}**

**\`\`\`[language] {1-3}**

**\`\`\`[language] showLineNumbers**

You can use the specifiers without a language.

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

Now, running `node example.js` you will see that each line of code is wrapped in a `div`, which has appropriate class names (`code-line`, `numbered-code-line`, `highlighted-code-line`)  and line numbering attribute `data-line-number`.

```html
<pre>
  <code class="hljs language-javascript">
    <div class="code-line numbered-code-line" data-line-number="1">
      <span class="hljs-keyword">let</span> a1;
    </div>
    <div
      class="code-line numbered-code-line highlighted-code-line" data-line-number="2">
      <span class="hljs-keyword">let</span> a2;
    </div>
    <div class="code-line numbered-code-line" data-line-number="3">
      <span class="hljs-keyword">let</span> a3;
    </div>
  </code>
</pre>
```

Without `rehype-highlight-code-lines`, the lines of code wouldn't be in a `div`.

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

## Options

All options are **optional** and have **default values**.

```typescript
type HighlightLinesOptions = {
  showLineNumbers?: boolean; // default is "false"
  lineContainerTagName?: "div" | "span"; // default is "span"
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

Now, all code blocks will become numbered. If you want to exclude a specific code block not to be numbered, use `noLineNumbers`.

**\`\`\`[language] noLineNumbers {2}**

**\`\`\`[language] noLineNumbers**

**\`\`\`noLineNumbers**

Sometimes you may want to start the line numbering from a specific number. In that cases, use `showLineNumbers=[number]` in code blocks. For example, below, the code block's line numbering will start from number `8`.

**\`\`\`[language] {2} showLineNumbers=8**

**\`\`\`[language] showLineNumbers=8**

**\`\`\`showLineNumbers=8**

#### `lineContainerTagName`

It is a **union** type option which is **"div" | "span"** for providing custom HTML tag name for code lines.

By default, it is `span` which is **inline** level container. If you set it as `div`, the container will be **block** level, in perspective of CSS.

```javascript
use(rehypeHighlightLines, {
  lineContainerTagName: "div",
});
```

Now, the code line container's tag name will be `div`.

### Examples:

```typescript
// line numbering will occur as per directive "showLineNumber" and code-line containers will be <span> inline element
use(rehypeHighlightLines);

// all code blocks will be numbered and code-line containers will be <div> block element
use(rehypeHighlightLines, {
  showLineNumbers: true,
  lineContainerTagName: "div",
});
```

**An example screen snapshot from a working app:**

![markdown code block input](https://github.com/rehypejs/rehype-highlight/assets/30029208/d597f4e5-d7ca-4a84-b843-950094e4a49b)
![markdown code block result](https://github.com/rehypejs/rehype-highlight/assets/30029208/908449d6-8028-4ecd-8536-3e747c725da7)

**Here you can find some demo applications below which the `rehype-highlight` and `rehype-highlight-code-lines` are used together:**
+ [demo blog application](https://next-mdx-remote-client-in-app-router.vercel.app/) using `next-mdx-remote-client` within `Next.js app router`
+ [demo blog application](https://next-mdx-remote-client-in-pages-router.vercel.app/) using `next-mdx-remote-client` within `Next.js pages router`

## Copying Code Block's Content Issue

When the line container is "div" block element, the end of line character (eol) at the end of line causes unwanted extra blank line. In order to fix the issue, I've **removed the eol when it is "div", but kept the eol when it is "span"**.

But, **the lack of the eol when "div" causes another issue.** If you implement a button for copying code block content, it doesn't work as expected since all code are printed in a single line. In order to work around the issue, you can implement an `onClick` of the `button` like below:

*I assume you use a `useRef` for `<pre>` element.*

```javascript
const onClick = () => {
  if (!preRef.current) return;

  // clone the <code> element in order not to cause any change in actual DOM
  const code = preRef.current.getElementsByTagName("code")[0].cloneNode(true);

  // add eol to each code-line since there is no eol at the end when they are div
  Array.from((code as HTMLElement).querySelectorAll("div.code-line")).forEach(
    (line) => {
      line.innerHTML = line.innerHTML + "\r";
    }
  );

  void navigator.clipboard.writeText(code.textContent ?? "");
};
```

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
  padding-left: 12px;
  padding-right: 12px;
  margin-left: -12px;
  margin-right: -12px;
  border-left: 4px solid transparent; /* prepare for highlighted code-lines */
}

div.code-line:empty {
  /* it is necessary because there is no even eol character in div code-lines */
  height: 15.5938px; /* calculated height */
}

span.code-line {
  min-width: 100%;
  display: inline-block;
}

.code-line.inserted {
  background-color: var(--color-inserted-line); /* inserted code-line (+) color */
}

.code-line.deleted {
  background-color: var(--color-deleted-line); /* deleted code-line (-) color */
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

This package is fully typed with [TypeScript][typescript].

The plugin exports the type `HighlightLinesOptions`.

## Compatibility

This plugin works with `rehype-parse` version 1+, `rehype-stringify` version 1+, `rehype` version 1+, and unified version `4+`.

## Security

Use of `rehype-highlight-code-lines` involves rehype (hast), but doesn't lead to cross-site scripting (XSS) attacks.

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

### My Recma Plugins

- [`recma-mdx-escape-missing-components`](https://www.npmjs.com/package/recma-mdx-escape-missing-components)
  – Recma plugin to set the default value `() => null` for the Components in MDX in case of missing or not provided so as not to throw an error
- [`recma-mdx-change-props`](https://www.npmjs.com/package/recma-mdx-change-props)
  – Recma plugin to change the `props` parameter into the `_props` in the `function _createMdxContent(props) {/* */}` in the compiled source in order to be able to use `{props.foo}` like expressions. It is useful for the `next-mdx-remote` or `next-mdx-remote-client` users in `nextjs` applications.

## License

[MIT License](./LICENSE) © ipikuka

### Keywords

🟩 [unified][unifiednpm] 🟩 [rehype][rehypenpm] 🟩 [rehype plugin][rehypepluginnpm] 🟩 [hast][hastnpm] 🟩 [markdown][markdownnpm] 🟩 [rehype-highlight][rehypehighlightnpm]

[unifiednpm]: https://www.npmjs.com/search?q=keywords:unified
[rehypenpm]: https://www.npmjs.com/search?q=keywords:rehype
[rehypepluginnpm]: https://www.npmjs.com/search?q=keywords:rehype%20plugin
[hastnpm]: https://www.npmjs.com/search?q=keywords:hast
[markdownnpm]: https://www.npmjs.com/search?q=keywords:markdown
[rehypehighlightnpm]: https://www.npmjs.com/search?q=keywords:rehype-highlight

[unified]: https://github.com/unifiedjs/unified
[micromark]: https://github.com/micromark/micromark
[remark]: https://github.com/remarkjs/remark
[remarkplugins]: https://github.com/remarkjs/remark/blob/main/doc/plugins.md
[mdast]: https://github.com/syntax-tree/mdast
[rehype]: https://github.com/rehypejs/rehype
[rehypeplugins]: https://github.com/rehypejs/rehype/blob/main/doc/plugins.md
[hast]: https://github.com/syntax-tree/hast
[typescript]: https://www.typescriptlang.org/
[rehype-highlight]: https://github.com/rehypejs/rehype-highlight

[badge-npm-version]: https://img.shields.io/npm/v/rehype-highlight-code-lines
[badge-npm-download]:https://img.shields.io/npm/dt/rehype-highlight-code-lines
[npm-package-url]: https://www.npmjs.com/package/rehype-highlight-code-lines

[badge-license]: https://img.shields.io/github/license/ipikuka/rehype-highlight-code-lines
[github-license-url]: https://github.com/ipikuka/rehype-highlight-code-lines/blob/main/LICENSE

[badge-build]: https://github.com/ipikuka/rehype-highlight-code-lines/actions/workflows/publish.yml/badge.svg
[github-workflow-url]: https://github.com/ipikuka/rehype-highlight-code-lines/actions/workflows/publish.yml

[badge-typescript]: https://img.shields.io/npm/types/rehype-highlight-code-lines
[typescript-url]: https://www.typescriptlang.org/
