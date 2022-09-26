import { ILogger } from './logger.interface.js';

export default class ConcoleLoggerService implements ILogger {
  public info(message: string, ...args: unknown[]): void {
    console.log(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    console.log(message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    console.log(message, ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    console.log(message, ...args);
  }
}
