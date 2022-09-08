import chalk from 'chalk';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { ICliCommand } from './cli-command.interface.js';

export default class ImportCommand implements ICliCommand {
  public readonly name = '--import';

  public execute(filename: string): void {
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch(err) {

      if (!(err instanceof Error)) {
        throw err;
      }
      console.log(chalk.hex('#DEADED').underline(`Не удалось импортировать данные из файла по причине: «${err.message}»`));
    }
  }
}
