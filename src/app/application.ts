import { inject, injectable } from 'inversify';
import { IConfig } from '../common/config/config.interface.js';
import { ILogger } from '../common/logger/logger.interface.js';
import { Component } from '../types/component.types.js';
import 'reflect-metadata';

@injectable()
export default class Application {
  private logger!: ILogger;
  private config!: IConfig;

  constructor(@inject(Component.ILogger) logger: ILogger, @inject(Component.IConfig) config: IConfig) {
    this.logger = logger;
    this.config = config;
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Server from .env file: ${this.config.get('HOST')}`);
  }
}
