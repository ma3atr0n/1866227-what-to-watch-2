import { ILogger } from './logger.interface.js';
import pino, {Logger} from 'pino';
import { injectable } from 'inversify';

@injectable()
export class LoggerService implements ILogger {
  private logger!: Logger;

  constructor() {
    this.logger = pino();
  }

  public info(message: string): void {
    this.logger.info(`info ${message}`);
  }

  public warn(message: string): void {
    this.logger.warn(`warn ${message}`);
  }

  public error(message: string): void {
    this.logger.error(`error ${message}`);
  }

  public debug(message: string): void {
    this.logger.debug(`debug ${message}`);
  }
}
