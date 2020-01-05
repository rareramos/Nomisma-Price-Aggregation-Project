import { Readable } from 'stream';

declare module '@react-pdf/renderer' {
  export const renderToStream : (html : JSX.Element) => string | Buffer | Readable;
}
