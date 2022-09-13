import { createWriteStream, WriteStream } from 'fs';
import { IFileWriter } from './file-writer.interface.js';

export class TSVFileWriter implements IFileWriter {
  private streamWrite: WriteStream;

  constructor(readonly fileName: string) {
    this.streamWrite = createWriteStream(this.fileName, {
      flags: 'w',
      encoding: 'utf-8',
      highWaterMark: 2 ** 16,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.streamWrite.write(`${row}\n`)) {
      return new Promise<void>((resolve) => {
        this.streamWrite.on('drain', () => resolve());
      });
    }

    Promise.resolve();
  }

}
