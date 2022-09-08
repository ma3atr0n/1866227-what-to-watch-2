import { ICliCommand } from './cli-command.interface.js';

export default class HelpCommand implements ICliCommand {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(
      `
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js --<command> [--arguments]
        Команды:
            --version:                      # выводит номер версии
            --help:                         # печатает этот текст
            --import <filepath>             # импортирует данные из TSV
            --generate <n> <filepath> <url> # генерирует произвольное количество тестовых данных
        `
    );
  }
}
