import type { Plugin } from "unified";
import type { Root, Element, Text, ElementContent } from "hast";
import { visit, type VisitorResult } from "unist-util-visit";
import rangeParser from "parse-numeric-range";

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

declare module "hast" {
  interface Data {
    meta?: string | undefined;
  }
}

type ElementWithTextNode = Element & {
  children: [Text];
};

export type HighlightLinesOptions = {
  showLineNumbers?: boolean;
  /**
   * @deprecated container tag name is always "span"
   * will be removed in the next versions
   */
  lineContainerTagName?: "div" | "span";
  trimBlankLines?: boolean;
};

const DEFAULT_SETTINGS: HighlightLinesOptions = {
  showLineNumbers: false,
  lineContainerTagName: "span",
  trimBlankLines: false,
};

type PartiallyRequiredHighlightLinesOptions = Prettify<
  PartiallyRequired<HighlightLinesOptions, "showLineNumbers" | "lineContainerTagName">
>;

type GutterOptions = {
  directiveShowLineNumbers: boolean | number;
  directiveHighlightLines: number[];
  directiveTrimBlankLines: boolean;
};

// a simple util for our use case, like clsx package
export function clsx(arr: (string | false | null | undefined | 0)[]): string[] {
  return arr.filter((item): item is string => !!item);
}

// check if it is a string array
function isStringArray(value: unknown): value is string[] {
  return (
    // type-coverage:ignore-next-line
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

// check if it is Element which first child is text
function isElementWithTextNode(node: ElementContent | undefined): node is ElementWithTextNode {
  return (
    node?.type === "element" &&
    node.children.length === 1 &&
    node.children[0].type === "text" &&
    "value" in node.children[0]
  );
}

function hasClassName(node: ElementContent | undefined, className: string): boolean {
  return (
    node?.type === "element" &&
    isStringArray(node.properties.className) &&
    node.properties.className.some((cls) => cls.includes(className))
  );
}

// match all common types of line breaks
const REGEX_LINE_BREAKS = /\r?\n|\r/g;
const REGEX_LINE_BREAKS_IN_THE_BEGINNING = /^(\r?\n|\r)+/;

/**
 *
 * add line numbers to code blocks and allow highlighting of desired code lines
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
   * check code element children need flattening or not
   *
   */
  function hasFlatteningNeed(code: Element): boolean {
    const elementContents = code.children;

    // type ElementContent = Comment | Element | Text
    for (const elemenContent of elementContents) {
      if (elemenContent.type === "element" && Boolean(elemenContent.children.length))
        if (elemenContent.children.some((ec) => ec.type === "element")) return true;
    }

    return false;
  }

  /**
   *
   * flatten deeper nodes into first level <span> and text, especially for languages like jsx, tsx
   * mutates the code, recursively
   * inspired from https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/src/highlight.js
   *
   */
  function flattenCodeTree(code: Element, className: string[] = []): ElementContent[] {
    const newTree: ElementContent[] = [];

    for (const elementContent of code.children) {
      if (elementContent.type === "comment" || elementContent.type === "text") {
        newTree.push(elementContent);
      } else {
        // @ts-expect-error className is different from other key of properties, and expected to be an array or undefined
        // /* v8 ignore next */
        const classNames = className.concat(elementContent.properties.className || []);

        if (
          elementContent.children.length === 1 &&
          elementContent.children[0].type !== "element"
        ) {
          elementContent.properties.className = classNames;
          newTree.push(elementContent);
        } else {
          newTree.push(...flattenCodeTree(elementContent, classNames));
        }
      }
    }

    // Mutate the original code object
    code.children = newTree;
    return newTree;
  }

  /**
   *
   * construct the line element
   *
   */
  const createLine = (
    children: ElementContent[],
    lineNumber: number,
    directiveShowLineNumbers: boolean | number,
    directiveHighlightLines: number[],
  ): Element => {
    const firstChild = children[0];
    const isAddition = hasClassName(firstChild, "addition");
    const isDeletion = hasClassName(firstChild, "deletion");

    return {
      type: "element",
      tagName: "span", // now it is always "span"
      children,
      properties: {
        className: clsx([
          "code-line",
          directiveShowLineNumbers && "numbered-code-line",
          directiveHighlightLines.includes(lineNumber) && "highlighted-code-line",
          isAddition && "inserted",
          isDeletion && "deleted",
        ]),
        dataLineNumber:
          typeof directiveShowLineNumbers === "number"
            ? directiveShowLineNumbers - 1 + lineNumber
            : directiveShowLineNumbers
              ? lineNumber
              : undefined,
      },
    };
  };

  /**
   *
   * handle elements which is multi line comment in code
   * mutates the code
   *
   */
  function handleMultiLineComments(code: Element): undefined {
    for (let index = 0; index < code.children.length; index++) {
      const replacement: ElementContent[] = [];

      const child = code.children[index];

      if (!isElementWithTextNode(child)) continue;

      const textNode = child.children[0];
      if (!REGEX_LINE_BREAKS.test(textNode.value)) continue;
      const comments = textNode.value.split(REGEX_LINE_BREAKS);

      for (let i = 0; i < comments.length; i++) {
        const newChild = structuredClone(child);
        newChild.children[0].value = comments[i];
        replacement.push(newChild);

        if (i < comments.length - 1) {
          replacement.push({ type: "text", value: "\n" }); // eol
        }
      }

      code.children = [
        ...code.children.slice(0, index),
        ...replacement,
        ...code.children.slice(index + 1),
      ];
    }
  }

  /**
   *
   * handle eol characters in the beginning of the only first element
   * (because gutter function does not check the first element in the HAST whether contain eol at the beginning)
   * mutates the code
   *
   */
  function handleFirstElementContent(code: Element): undefined {
    const elementNode = code.children[0];
    if (!isElementWithTextNode(elementNode)) return;

    const textNode = elementNode.children[0];
    if (!REGEX_LINE_BREAKS_IN_THE_BEGINNING.test(textNode.value)) return;

    const match = REGEX_LINE_BREAKS_IN_THE_BEGINNING.exec(textNode.value);

    if (match) {
      code.children.unshift({ type: "text", value: match[0] });

      textNode.value = textNode.value.replace(REGEX_LINE_BREAKS_IN_THE_BEGINNING, "");
    }
  }

  /**
   *
   * handle trimming blank line for the last text node
   *
   */
  function handleTrimmingBlankLines(code: Element, directiveTrimBlankLines: boolean) {
    if (!directiveTrimBlankLines) return;

    const lastChild = code.children[code.children.length - 1];

    if (lastChild.type === "text") {
      if (/(\r?\n|\r)(\1)$/.test(lastChild.value)) {
        lastChild.value = lastChild.value.replace(/(\r?\n|\r)(\1)$/, "$1");
      }
    }
  }

  /**
   *
   * extract the lines from HAST of code element
   * mutates the code
   *
   */
  function gutter(
    code: Element,
    {
      directiveShowLineNumbers,
      directiveHighlightLines,
      directiveTrimBlankLines,
    }: GutterOptions,
  ) {
    hasFlatteningNeed(code) && flattenCodeTree(code); // mutates the code

    handleFirstElementContent(code); // mutates the code

    handleMultiLineComments(code); // mutates the code

    handleTrimmingBlankLines(code, directiveTrimBlankLines);

    const replacement: ElementContent[] = [];

    let start = 0;
    let startTextRemainder = "";
    let lineNumber = 0;

    for (let index = 0; index < code.children.length; index++) {
      const child = code.children[index];

      if (child.type !== "text") continue;

      let textStart = 0;

      const matches = Array.from(child.value.matchAll(REGEX_LINE_BREAKS));
      matches.forEach((match, iteration) => {
        // Nodes in this line. (current child (index) is exclusive)
        const line = code.children.slice(start, index);

        // Prepend text from a partial matched earlier text.
        if (startTextRemainder) {
          line.unshift({ type: "text", value: startTextRemainder });
          startTextRemainder = "";
        }

        // Append text from this text.
        if (match.index > textStart) {
          const value = child.value.slice(textStart, match.index);
          line.push({ type: "text", value });
        }

        const isFirstIteration = index === 0 && iteration === 0;

        if (isFirstIteration && directiveTrimBlankLines && line.length === 0) {
          replacement.push({ type: "text", value: match[0] }); // eol
        } else {
          lineNumber += 1;
          replacement.push(
            createLine(line, lineNumber, directiveShowLineNumbers, directiveHighlightLines),
            { type: "text", value: match[0] }, // eol
          );
        }

        start = index + 1;
        textStart = match.index + match[0].length;
      });

      // If we matched, make sure to not drop the text after the last line ending.
      if (start === index + 1) {
        startTextRemainder = child.value.slice(textStart);
      }
    }

    const line = code.children.slice(start);

    // Prepend text from a partial matched earlier text.
    if (startTextRemainder) {
      line.unshift({ type: "text", value: startTextRemainder });
      startTextRemainder = "";
    }

    if (line.length > 0) {
      directiveTrimBlankLines
        ? replacement.push(...line)
        : replacement.push(
            createLine(line, ++lineNumber, directiveShowLineNumbers, directiveHighlightLines),
          );
    }

    // Replace children with new array.
    code.children = replacement;
  }

  /**
   *
   * get the programming language analyzing the classNames
   *
   */
  function getLanguage(classNames: string[] | undefined): string | undefined {
    if (!classNames) return;

    const isLanguageString = (element: string): boolean =>
      element.startsWith("language-") || element.startsWith("lang-");

    const languageString = classNames.find(isLanguageString);

    if (!languageString) return;

    const language = languageString.slice(languageString.indexOf("-") + 1).toLowerCase();

    return language;
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
    visit(tree, "element", function (code, index, parent): VisitorResult {
      if (!parent || index === undefined || code.tagName !== "code") {
        return;
      }

      if (parent.type !== "element" || parent.tagName !== "pre") {
        return;
      }

      const classNames = code.properties.className;

      // only for type narrowing
      /* v8 ignore next */
      if (!isStringArray(classNames) && classNames !== undefined) return;

      let meta = code.data?.meta?.toLowerCase().trim() ?? "";

      const language = getLanguage(classNames);

      if (
        language?.startsWith("{") ||
        language?.startsWith("showlinenumbers") ||
        language?.startsWith("nolinenumbers") ||
        language?.startsWith("trimblanklines")
      ) {
        // add specifiers to meta
        meta = (language + " " + meta).trim();

        // correct the code's meta
        code.data && (code.data.meta = meta);

        // remove all classnames like hljs, lang-{1,3}, language-showLineNumbers, because of false positive
        code.properties.className = undefined;
      }

      let directiveShowLineNumbers: boolean | number = meta.includes("nolinenumbers")
        ? false
        : settings.showLineNumbers || meta.includes("showlinenumbers");

      // find the number where the line number starts, if exists
      const REGEX1 = /showlinenumbers=(?<start>\d+)/i;
      const start = REGEX1.exec(meta)?.groups?.start;
      if (start && !isNaN(Number(start))) directiveShowLineNumbers = Number(start);

      // find number range string within curly braces and parse it
      const REGEX2 = /{(?<lines>[\d\s,-]+)}/g;
      const strLineNumbers = REGEX2.exec(meta)?.groups?.lines?.replace(/\s/g, "");
      const directiveHighlightLines = strLineNumbers ? rangeParser(strLineNumbers) : [];

      // find the directive for trimming blank lines
      const REGEX3 = /trimblanklines/i;
      const directiveTrimBlankLines = settings.trimBlankLines || REGEX3.test(meta);

      // if nothing to do for numbering, highlihting or trimming blank lines, just return;
      if (
        directiveShowLineNumbers === false &&
        directiveHighlightLines.length === 0 &&
        directiveTrimBlankLines === false
      ) {
        return;
      }

      // add container for each line mutating the code element
      gutter(code, {
        directiveShowLineNumbers,
        directiveHighlightLines,
        directiveTrimBlankLines,
      });
    });
  };
};

export default plugin;
