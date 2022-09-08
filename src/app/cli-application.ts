import { ICliCommand } from '../cli-command/cli-command.interface.js';

type ParsedCommand = {
  [key: string]: string[];
}

export default class CliApplication {
  private commands: {[propertyName: string]: ICliCommand} = {};
  private defaultCommand = '--help';

  private parseCommand(cliArguments: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let command = '';

    return cliArguments.reduce((acc, item) => {
      if (item.startsWith('--')) {
        acc[item] = [];
        command = item;
      } else if (command && item) {
        acc[command].push(item);
      }

      return acc;
    }, parsedCommand);
  }

  public registerCommands(commandsList: ICliCommand[]): void {
    this.commands = commandsList.reduce((acc, command) => {
      acc[command.name] = command;
      return acc;
    }, this.commands);
  }

  public getCommand(commandName: string): ICliCommand {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = this.parseCommand(argv);
    console.log('Комманда:', parsedCommand);
    const [commandName] = Object.keys(parsedCommand);
    console.log('Выбранное имя команды:', commandName);
    console.log('Список всех комманд:', this.commands);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);

  }
}
