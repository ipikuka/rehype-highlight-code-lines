import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import type { VFileCompatible, VFile } from "vfile";

import plugin, { type HighlightLinesOptions } from "../../src/index.js";

const compilerCreator = (options?: HighlightLinesOptions) =>
  unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeHighlight)
    .use(plugin, options)
    .use(rehypeStringify);

export const processFromHtml = async (
  content: VFileCompatible,
  options?: HighlightLinesOptions,
): Promise<VFile> => {
  return compilerCreator(options).process(content);
};
