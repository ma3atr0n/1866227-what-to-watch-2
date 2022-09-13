import got from 'got';
import { TSVFileWriter } from '../common/file-writer/tsv-file-writer.js';
import { FilmGenerator } from '../common/generator/film-generator.js';
import { MockData } from '../types/mock.type.js';
import { ICliCommand } from './cli-command.interface.js';

export class GenerateCommand implements ICliCommand {
  public readonly name = '--generate';
  private initilaData!: MockData;

  public async execute(...parameters: string[]) {
    const [count, path, url] = parameters;
    if (count === undefined || path === undefined || url === undefined) {
      console.log('Укажите все параметры комманды --generate');
      return;
    }
    const filmCount = Number.parseInt(count, 10);

    try {
      this.initilaData = await got.get(url).json();
    } catch {
      return console.log(`Не могу получить данных по ссылке: ${url}`);
    }

    const filmGeneratorString = new FilmGenerator(this.initilaData);
    const writeStream = new TSVFileWriter(path);

    for (let i = 0; i < filmCount; i++) {
      await writeStream.write(filmGeneratorString.generate());
    }

    console.log(`Файл ${path} успешно сформирован`);
  }
}
