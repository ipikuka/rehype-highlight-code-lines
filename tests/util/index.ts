import { unified } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import type { VFileCompatible, VFile } from "vfile";

import plugin, { type HighlightLinesOptions } from "../../src";

const compilerCreator = (options?: HighlightLinesOptions) =>
  unified()
    .use(remarkParse)
    .use(gfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(plugin, options)
    .use(rehypeStringify);

export const process = async (
  content: VFileCompatible,
  options?: HighlightLinesOptions,
): Promise<VFile> => {
  return compilerCreator(options).process(content);
};
