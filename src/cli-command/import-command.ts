import chalk from 'chalk';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { createFilms } from '../utils/common.js';
import { ICliCommand } from './cli-command.interface.js';

export default class ImportCommand implements ICliCommand {
  public readonly name = '--import';

  private onLine(line: string) {
    const film = createFilms(line);
    console.log(film);
  }

  private onEnd(count: number) {
    console.log(`${count} строк проимпортировано!`);
  }

  public execute(filename: string): void {
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onEnd);

    try {
      fileReader.read();
    } catch(err) {

      if (!(err instanceof Error)) {
        throw err;
      }
      console.log(chalk.hex('#DEADED').underline(`Не удалось импортировать данные из файла по причине: «${err.message}»`));
    }
  }
}
