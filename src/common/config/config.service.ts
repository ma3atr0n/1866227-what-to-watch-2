import { IConfig } from './config.interface.js';
import { config } from 'dotenv';
import { ILogger } from '../logger/logger.interface.js';
import { ConfigSchema, configSchema } from './config.schema.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import 'reflect-metadata';

@injectable()
export default class ConfigService implements IConfig {
  private config: ConfigSchema;
  private logger: ILogger;

  constructor(@inject(Component.ILogger) logger: ILogger) {
    this.logger = logger;

    const parsedOutput = config();
    if (parsedOutput.error) {
      throw new Error('.env file not found!');
    }

    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }


  public get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key];
  }
}
