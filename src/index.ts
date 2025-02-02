import type { Plugin } from "unified";
import type { Root, Element, ElementContent, ElementData } from "hast";
import { SKIP, type VisitorResult, visit } from "unist-util-visit";
import rangeParser from "parse-numeric-range";

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type HighlightLinesOptions = {
  showLineNumbers?: boolean;
  lineContainerTagName?: "div" | "span";
};

const DEFAULT_SETTINGS: HighlightLinesOptions = {
  showLineNumbers: false,
  lineContainerTagName: "span",
};

type PartiallyRequiredHighlightLinesOptions = Prettify<
  PartiallyRequired<HighlightLinesOptions, "showLineNumbers" | "lineContainerTagName">
>;

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
  const settings = Object.assign(
    {},
    DEFAULT_SETTINGS,
    options,
  ) as PartiallyRequiredHighlightLinesOptions;

  /**
   *
   * check code element children needs flattening
   *
   */
  function checkCodeTreeForFlatteningNeed(contents: ElementContent[]): boolean {
    // type ElementContent = Comment | Element | Text
    for (const content of contents) {
      if (content.type === "element")
        if (content.children.length >= 1 && content.children[0].type === "element") return true;
    }

    return false;
  }

  /**
   *
   * flatten code element children, recursively
   * inspired from https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/src/highlight.js
   *
   */
  function flattenCodeTree(
    contents: ElementContent[],
    className: string[] = [],
    newTree: ElementContent[] = [],
  ): ElementContent[] {
    // type ElementContent = Comment | Element | Text
    for (const content of contents) {
      if (content.type === "comment" || content.type === "text") {
        newTree = newTree.concat([content]);
      } else {
        // @ts-expect-error className is different from other key of properties, and expected as an array
        // /* v8 ignore next */
        const classNames = className.concat(content.properties.className || []);

        if (content.children.length === 1 && content.children[0].type !== "element") {
          content.properties.className = classNames;
          newTree = newTree.concat([content]);
        } else {
          newTree = newTree.concat(flattenCodeTree(content.children, classNames));
        }
      }
    }
    return newTree;
  }

  /**
   *
   * constructs the line element
   *
   */
  const createLine = (
    children: ElementContent[],
    lineNumber: number,
    startingNumber: number,
    showLineNumbers: boolean,
    linesToBeHighlighted: number[],
  ): Element => {
    const firstChild = children[0];

    const isAddition =
      firstChild?.type === "element" &&
      Array.isArray(firstChild.properties.className) &&
      firstChild.properties.className.some(
        (cls) => typeof cls === "string" && cls.includes("addition"),
      );

    const isDeletion =
      firstChild?.type === "element" &&
      Array.isArray(firstChild.properties.className) &&
      firstChild.properties.className.some(
        (cls) => typeof cls === "string" && cls.includes("deletion"),
      );

    return {
      type: "element",
      tagName: settings.lineContainerTagName,
      children,
      properties: {
        className: clsx([
          "code-line",
          showLineNumbers && "numbered-code-line",
          linesToBeHighlighted.includes(lineNumber) && "highlighted-code-line",
          isAddition && "inserted",
          isDeletion && "deleted",
        ]),
        dataLineNumber: showLineNumbers ? startingNumber - 1 + lineNumber : undefined,
      },
    };
  };

  // match all common types of line breaks
  const REGEX_LINE_BREAKS = /\r?\n|\r/g;

  function gutter(
    tree: Element,
    showLineNumbers: boolean,
    startingNumber: number,
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
        let match = REGEX_LINE_BREAKS.exec(child.value);

        while (match) {
          // Nodes in this line. (current child is exclusive)
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
            const value = child.value.slice(textStart, match.index);
            line.push({ type: "text", value });
          }

          // Add a line
          lineNumber += 1;
          replacement.push(
            createLine(line, lineNumber, startingNumber, showLineNumbers, linesToBeHighlighted),
          );

          // Add eol if the tag name is "span"
          if (settings.lineContainerTagName === "span") {
            replacement.push({ type: "text", value: match[0] });
          }

          start = index + 1;
          textStart = match.index + match[0].length;
          match = REGEX_LINE_BREAKS.exec(child.value);
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
        createLine(line, lineNumber, startingNumber, showLineNumbers, linesToBeHighlighted),
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
      if (!parent || index === undefined || node.tagName !== "pre") {
        return;
      }

      const code = node.children[0];

      /* v8 ignore next */
      if (!code || code.type !== "element" || code.tagName !== "code") {
        return SKIP;
      }

      // handle if there is no language provided in the code block
      const classNames = code.properties.className;

      // only for type narrowing
      if (!Array.isArray(classNames) && classNames !== undefined) return;

      let meta = (code.data as CodeData)?.meta?.toLowerCase().trim();

      const testingFunction = (element: string | number): element is string =>
        typeof element === "string" && element.startsWith("language-");

      const className = classNames?.find(testingFunction);

      // if (!className) return;

      if (className) {
        const language = className.slice(9).toLowerCase();

        if (
          language.startsWith("{") ||
          language.startsWith("showlinenumbers") ||
          language.startsWith("nolinenumbers")
        ) {
          meta = meta ? language + meta : language;

          code.properties.className = undefined;
        }
      }

      if (settings.showLineNumbers) {
        if (!meta) {
          meta = "showlinenumbers";
        } else if (!meta.includes("showlinenumbers")) {
          meta = meta + " showlinenumbers";
        }
      }

      if (!meta) return;

      const showLineNumbers = meta.includes("nolinenumbers")
        ? false
        : meta.includes("showlinenumbers");

      let startingNumber = 1;

      if (showLineNumbers) {
        const REGEX1 = /showlinenumbers=(?<start>\d+)/i;
        const start = REGEX1.exec(meta)?.groups?.start;
        if (start && !isNaN(Number(start))) startingNumber = Number(start);
      }

      // find number range string within curly braces and parse it
      const REGEX2 = /{(?<lines>[\d\s,-]+)}/g;
      const strLineNumbers = REGEX2.exec(meta)?.groups?.lines?.replace(/\s/g, "");
      const linesToBeHighlighted = strLineNumbers ? rangeParser(strLineNumbers) : [];

      if (!showLineNumbers && linesToBeHighlighted.length === 0) return;

      // flatten deeper nodes into first level <span> and text
      if (checkCodeTreeForFlatteningNeed(code.children)) {
        code.children = flattenCodeTree(code.children);
      }

      // add wrapper for each line mutating the code element
      gutter(code, showLineNumbers, startingNumber, linesToBeHighlighted);
    });
  };
};

export default plugin;
