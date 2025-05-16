declare module 'stream-to-buffer' {
  import { Readable } from 'stream';
  function toBuffer(
    stream: Readable,
    callback: (err: Error | null, buffer: Buffer) => void
  ): void;
  export default toBuffer;
}
