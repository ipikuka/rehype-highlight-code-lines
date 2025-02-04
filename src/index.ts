import type { Plugin } from "unified";
import type { Root, Element, ElementContent, ElementData } from "hast";
import { visit, type VisitorResult } from "unist-util-visit";
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
  function checkCodeTreeForFlatteningNeed(code: Element): boolean {
    const elementContents = code.children;

    // type ElementContent = Comment | Element | Text
    for (const elemenContent of elementContents) {
      if (elemenContent.type === "element")
        if (elemenContent.children.length >= 1 && elemenContent.children[0].type === "element")
          return true;
    }

    return false;
  }

  /**
   *
   * flatten code element children, recursively
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
    startingNumber: number,
    directiveShowLineNumbers: boolean,
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
          directiveShowLineNumbers && "numbered-code-line",
          linesToBeHighlighted.includes(lineNumber) && "highlighted-code-line",
          isAddition && "inserted",
          isDeletion && "deleted",
        ]),
        dataLineNumber: directiveShowLineNumbers ? startingNumber - 1 + lineNumber : undefined,
      },
    };
  };

  // match all common types of line breaks
  const REGEX_LINE_BREAKS = /\r?\n|\r/g;

  /**
   *
   * check the code line is empty or with value only spaces
   *
   */
  function isEmptyLine(line: ElementContent[]): boolean {
    return (
      line.length === 0 ||
      (line.length === 1 && line[0].type === "text" && line[0].value.trim() === "")
    );
  }

  function gutter(
    tree: Element,
    directiveShowLineNumbers: boolean,
    startingNumber: number,
    linesToBeHighlighted: number[],
  ) {
    const replacement: ElementContent[] = [];

    let index = -1;
    let start = 0;
    let startTextRemainder = "";
    let lineNumber = 0;

    while (++index < tree.children.length) {
      const child = tree.children[index];

      if (child.type !== "text") continue;

      let textStart = 0;
      let match = REGEX_LINE_BREAKS.exec(child.value);

      while (match !== null) {
        // Nodes in this line. (current child is exclusive)
        const line = tree.children.slice(start, index);

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

        if (!isEmptyLine(line)) {
          lineNumber += 1;
          replacement.push(
            createLine(
              line,
              lineNumber,
              startingNumber,
              directiveShowLineNumbers,
              linesToBeHighlighted,
            ),
          );
        }

        // Add eol if the tag name is "span"
        if (settings.lineContainerTagName === "span") {
          replacement.push({ type: "text", value: match[0] });
        }

        start = index + 1;
        textStart = match.index + match[0].length;

        // iterate the match
        match = REGEX_LINE_BREAKS.exec(child.value);
      }

      // If we matched, make sure to not drop the text after the last line ending.
      if (start === index + 1) {
        startTextRemainder = child.value.slice(textStart);
      }
    }

    const line = tree.children.slice(start);

    // Prepend text from a partial matched earlier text.
    if (startTextRemainder) {
      line.unshift({ type: "text", value: startTextRemainder });
      startTextRemainder = "";
    }

    if (!isEmptyLine(line)) {
      if (line.length > 0) {
        lineNumber += 1;
        replacement.push(
          createLine(
            line,
            lineNumber,
            startingNumber,
            directiveShowLineNumbers,
            linesToBeHighlighted,
          ),
        );
      }
    }

    // Replace children with new array.
    tree.children = replacement;
  }

  /**
   *
   * get the programming language analyzing the classNames
   *
   */
  function getLanguage(classNames: (string | number)[] | undefined): string | undefined {
    const isLanguageString = (element: string | number): element is string => {
      return String(element).startsWith("language-") || String(element).startsWith("lang-");
    };

    const languageString = classNames?.find(isLanguageString);

    if (languageString?.slice(0, 5) === "lang-") {
      return languageString.slice(5).toLowerCase();
    }

    if (languageString?.slice(0, 9) === "language-") {
      return languageString.slice(9).toLowerCase();
    }

    return languageString;
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
      if (!parent || index === undefined || node.tagName !== "code") {
        return;
      }

      if (parent.type !== "element" || parent.tagName !== "pre") {
        return;
      }

      const code = node;

      const classNames = code.properties.className;

      // only for type narrowing
      /* v8 ignore next */
      if (!Array.isArray(classNames) && classNames !== undefined) return;

      let meta = (code.data as CodeData)?.meta?.toLowerCase().trim() || "";

      const language = getLanguage(classNames);

      if (
        language?.startsWith("{") ||
        language?.startsWith("showlinenumbers") ||
        language?.startsWith("nolinenumbers")
      ) {
        // add specifiers to meta
        meta = (language + " " + meta).trim();

        // remove all classnames like hljs, lang-x, language-x, because of false positive
        code.properties.className = undefined;
      }

      const directiveShowLineNumbers = meta.includes("nolinenumbers")
        ? false
        : settings.showLineNumbers || meta.includes("showlinenumbers");

      let startingNumber = 1;

      // find the number where the line number starts, if exists
      if (directiveShowLineNumbers) {
        const REGEX1 = /showlinenumbers=(?<start>\d+)/i;
        const start = REGEX1.exec(meta)?.groups?.start;
        if (start && !isNaN(Number(start))) startingNumber = Number(start);
      }

      // find number range string within curly braces and parse it
      const REGEX2 = /{(?<lines>[\d\s,-]+)}/g;
      const strLineNumbers = REGEX2.exec(meta)?.groups?.lines?.replace(/\s/g, "");
      const linesToBeHighlighted = strLineNumbers ? rangeParser(strLineNumbers) : [];

      // if nothing to do for numbering and highlihting, just return
      if (!directiveShowLineNumbers && linesToBeHighlighted.length === 0) return;

      // flatten deeper nodes into first level <span> and text, especially for languages like jsx, tsx
      if (checkCodeTreeForFlatteningNeed(code)) {
        flattenCodeTree(code);
      }

      // add container for each line mutating the code element
      gutter(code, directiveShowLineNumbers, startingNumber, linesToBeHighlighted);
    });
  };
};

export default plugin;
