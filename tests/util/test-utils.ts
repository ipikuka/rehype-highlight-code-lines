declare global {
  interface String {
    prettifyPre(): string;
    prettifyPreCode(): string;
  }
}

String.prototype.prettifyPre = function () {
  return this.replace(/<pre>(?!\n)/g, "<pre>\n");
};

String.prototype.prettifyPreCode = function () {
  return this.replace(/<pre>(?!\n)/g, "<pre>\n").replace(
    /<code(?:\s[^>]*)?>/g,
    (match: string) => match + "\n",
  );
};

export {};
