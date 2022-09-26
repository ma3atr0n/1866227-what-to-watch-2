import { createReadStream } from 'fs';
import { EventEmitter } from 'events';
import { IFileReader } from './file-reader.interface.js';

const READ_SIZE = 16384;

export default class TSVFileReader extends EventEmitter implements IFileReader {
  constructor(readonly fileName: string) {
    super();
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.fileName, {
      highWaterMark: READ_SIZE,
      encoding: 'utf-8'
    });

    let lineRead = '';
    let endLinePosition = -1;
    let ImpotedRowCount = 0;

    for await (const chunk  of readStream) {
      lineRead += chunk.toString();
      while ((endLinePosition = lineRead.indexOf('\n')) >= 0) {
        const completeRow = lineRead.slice(0, endLinePosition + 1);
        lineRead = lineRead.slice(++endLinePosition);
        ImpotedRowCount++;

        await new Promise((resolve) => {
          this.emit('line', completeRow, resolve);
        });
      }
    }

    this.emit('end', ImpotedRowCount);
  }
}
