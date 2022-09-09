export interface ICliCommand {
  readonly name: string;
  execute(...parameters: string[]): void;
}
