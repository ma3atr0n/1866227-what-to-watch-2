import { inject, injectable } from 'inversify';
import { IConfig } from '../common/config/config.interface.js';
import { ILogger } from '../common/logger/logger.interface.js';
import { Component } from '../types/component.types.js';
import 'reflect-metadata';
import { IDBClient } from '../common/database-client/database.interface.js';
import { getURI } from '../utils/db.js';
import express, { Express } from 'express';
import { IController } from '../common/controller/controller.interface.js';
import { IExceptionFilter } from '../common/errors/exception-filter.interface.js';

@injectable()
export default class Application {
  private expressApp!: Express;

  constructor(
    @inject(Component.ILogger) private logger: ILogger,
    @inject(Component.IConfig) private config: IConfig,
    @inject(Component.IDBClient) private DBClient: IDBClient,
    @inject(Component.userController) private userController: IController,
    @inject(Component.IExceptionFilter) private exceptionFilter: IExceptionFilter,
  ) {
    this.expressApp = express();
  }

  public initRouters() {
    this.expressApp.use('/users', this.userController.router);
  }

  public initMiddleware() {
    this.expressApp.use(express.json());
  }

  public initExceptionFilter() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
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

    this.initMiddleware();
    this.initExceptionFilter();
    this.initRouters();
    this.expressApp.listen(this.config.get('APP_PORT'));
    this.logger.info(`Server started on port: ${this.config.get('APP_PORT')}`);
  }
}

