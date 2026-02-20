declare module "dom-to-image-more" {
  interface Options {
    quality?: number;
    width?: number;
    height?: number;
    style?: Record<string, string>;
    cacheBust?: boolean;
    filter?: (node: Node) => boolean;
    bgcolor?: string;
    imagePlaceholder?: string;
  }

  const domtoimage: {
    toPng(node: Node, options?: Options): Promise<string>;
    toJpeg(node: Node, options?: Options): Promise<string>;
    toBlob(node: Node, options?: Options): Promise<Blob>;
    toSvg(node: Node, options?: Options): Promise<string>;
    toPixelData(node: Node, options?: Options): Promise<Uint8ClampedArray>;
  };

  export default domtoimage;
}
