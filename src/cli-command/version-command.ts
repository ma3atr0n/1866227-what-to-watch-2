import { ICliCommand } from './cli-command.interface.js';
import { readFileSync } from 'fs';

export default class VesionCommand implements ICliCommand {
  public readonly name = '--version';

  readVersion() {
    const contentJSON = readFileSync('./package.json', {encoding: 'utf-8'});
    const content = JSON.parse(contentJSON);
    return content.version;

  }

  public async execute() {
    const version = this.readVersion();
    console.log(version);
  }
}
