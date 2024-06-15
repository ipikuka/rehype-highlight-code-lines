import type { Plugin } from "unified";
import type { Root, Element, ElementContent, ElementData } from "hast";
import { type VisitorResult, visit, CONTINUE } from "unist-util-visit";
import rangeParser from "parse-numeric-range";

export type HighlightLinesOptions = {
  showLineNumbers?: boolean;
};

const DEFAULT_SETTINGS: HighlightLinesOptions = {
  showLineNumbers: false,
};

type CodeData = ElementData & {
  meta?: string;
};

// a simple util for our use case, like clsx package
export function clsx(arr: (string | false | null | undefined | 0)[]): string[] {
  return arr.filter((item): item is string => !!item);
}

/**
 *
 * adds line numbers to code blocks and allow highlighting of desired code lines
 *
 */
const plugin: Plugin<[HighlightLinesOptions?], Root> = (options) => {
  const settings = Object.assign({}, DEFAULT_SETTINGS, options);

  /**
   *
   * constructs the line element
   *
   */
  const createLine = (
    children: ElementContent[],
    lineNumber: number | undefined,
    classNames: string[],
  ): Element => {
    return {
      type: "element",
      tagName: "div",
      children,
      properties: {
        className: classNames,
        ...(lineNumber && { "data-line-number": lineNumber }),
      },
    };
  };

  // match all common types of line breaks
  const RE = /\r?\n|\r/g;

  function starryNightGutter(
    tree: Element,
    showLineNumbers: boolean,
    linesToBeHighlighted: number[],
  ) {
    const replacement: Array<ElementContent> = [];
    let index = -1;
    let start = 0;
    let startTextRemainder = "";
    let lineNumber = 0;

    while (++index < tree.children.length) {
      const child = tree.children[index];

      if (child.type === "text") {
        let textStart = 0;
        let match = RE.exec(child.value);

        while (match) {
          // Nodes in this line.
          const line = tree.children.slice(start, index);

          /* v8 ignore start */

          // Prepend text from a partial matched earlier text.
          if (startTextRemainder) {
            line.unshift({ type: "text", value: startTextRemainder });
            startTextRemainder = "";
          }

          /* v8 ignore end */

          // Append text from this text.
          if (match.index > textStart) {
            line.push({
              type: "text",
              value: child.value.slice(textStart, match.index),
            });
          }

          // Add a line, and the eol.
          lineNumber += 1;
          replacement.push(
            createLine(
              line,
              showLineNumbers ? lineNumber : undefined,
              clsx([
                "code-line",
                showLineNumbers && "numbered-code-line",
                linesToBeHighlighted.includes(lineNumber) && "highlighted-code-line",
              ]),
            ),
            {
              type: "text",
              value: match[0],
            },
          );

          start = index + 1;
          textStart = match.index + match[0].length;
          match = RE.exec(child.value);
        }

        // If we matched, make sure to not drop the text after the last line ending.
        if (start === index + 1) {
          startTextRemainder = child.value.slice(textStart);
        }
      }
    }

    const line = tree.children.slice(start);

    /* v8 ignore start */

    // Prepend text from a partial matched earlier text.
    if (startTextRemainder) {
      line.unshift({ type: "text", value: startTextRemainder });
      startTextRemainder = "";
    }

    if (line.length > 0) {
      lineNumber += 1;
      replacement.push(
        createLine(
          line,
          showLineNumbers ? lineNumber : undefined,
          clsx([
            "code-line",
            showLineNumbers && "numbered-code-line",
            linesToBeHighlighted.includes(lineNumber) && "highlighted-code-line",
          ]),
        ),
      );
    }

    /* v8 ignore end */

    // Replace children with new array.
    tree.children = replacement;
  }

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return (tree: Root): undefined => {
    visit(tree, "element", function (node, index, parent): VisitorResult {
      /* v8 ignore next */
      if (!parent || typeof index === "undefined") return;

      if (node.tagName !== "pre") return CONTINUE;

      const code = node.children[0];

      /* v8 ignore next */
      if (!code || code.type !== "element" || code.tagName !== "code") return;

      let meta = (code.data as CodeData)?.meta?.toLowerCase().trim();

      // handle if there is no language provided in code block
      if (Array.isArray(code.properties.className)) {
        const testingFunction = (element: string | number): element is string =>
          typeof element === "string" && element.startsWith("language-");

        const className = code.properties.className.find(testingFunction);

        if (className) {
          const language = className.slice(9).toLowerCase();

          if (language.startsWith("{") || language.startsWith("showlinenumbers")) {
            meta = meta ? language + meta : language;

            const index = code.properties.className.findIndex(testingFunction);

            if (index > -1) {
              code.properties.className[index] = "language-unknown";
            }
          }
        }
      }

      if (!meta) return;

      const showLineNumbers = settings.showLineNumbers || meta.includes("showlinenumbers");

      // find number range string within curly braces and parse it
      const RE = /{(?<lines>[\d\s,-]+)}/g;
      const strLineNumbers = RE.exec(meta)?.groups?.lines?.replace(/\s/g, "");
      const linesToBeHighlighted = strLineNumbers ? rangeParser(strLineNumbers) : [];

      if (!showLineNumbers && linesToBeHighlighted.length === 0) return;

      // add wrapper for each line mutating the code element
      starryNightGutter(code, showLineNumbers, linesToBeHighlighted);
    });
  };
};

export default plugin;
