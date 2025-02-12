declare global {
  interface String {
    prettifyPre(): string;
  }
}

String.prototype.prettifyPre = function () {
  return this.replace(/<pre>(?!\n)/g, "<pre>\n");
};

export {};
