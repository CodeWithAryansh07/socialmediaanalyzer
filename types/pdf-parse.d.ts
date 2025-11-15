declare module 'pdf-parse' {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown>;
    text: string;
    version: string;
  }

  export class PDFParse {
    constructor();
    parse(dataBuffer: Buffer | ArrayBuffer, options?: Record<string, unknown>): Promise<PDFData>;
  }
}
