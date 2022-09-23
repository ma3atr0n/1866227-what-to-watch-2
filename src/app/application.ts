import { inject, injectable } from 'inversify';
import { IConfig } from '../common/config/config.interface.js';
import { ILogger } from '../common/logger/logger.interface.js';
import { Component } from '../types/component.types.js';
import 'reflect-metadata';
import { IDBClient } from '../common/database-client/database.interface.js';
import { getURI } from '../utils/db.js';
import { myModel } from '../modules/user/user.model.js';

@injectable()
export default class Application {
  private logger!: ILogger;
  private config!: IConfig;
  private DBClient!: IDBClient;

  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IConfig) config: IConfig,
    @inject(Component.IDBClient) DBClient: IDBClient,
  ) {
    this.logger = logger;
    this.config = config;
    this.DBClient = DBClient;
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Server from .env file: ${this.config.get('DB_HOST')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.DBClient.connect(uri);

    console.log(myModel.email);
  }
}
