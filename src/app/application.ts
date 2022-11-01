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
import AuthenticateMiddleware from '../common/middlewares/authenticate.middleware.js';
import { getFullServerPath } from '../utils/common.js';
import cors from 'cors';

@injectable()
export default class Application {
  private expressApp!: Express;

  constructor(
    @inject(Component.ILogger) private logger: ILogger,
    @inject(Component.IConfig) private config: IConfig,
    @inject(Component.IDBClient) private DBClient: IDBClient,
    @inject(Component.userController) private userController: IController,
    @inject(Component.filmController) private filmController: IController,
    @inject(Component.filmPromoController) private filmPromoController: IController,
    @inject(Component.favoriteController) private favoriteController: IController,
    @inject(Component.commentController) private commentController: IController,
    @inject(Component.IExceptionFilter) private exceptionFilter: IExceptionFilter,
  ) {
    this.expressApp = express();
  }

  public initRouters() {
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/films', this.filmController.router);
    this.expressApp.use('/promo', this.filmPromoController.router);
    this.expressApp.use('/favorite', this.favoriteController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  public initMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY')),
    );
    this.expressApp.use(
      '/static',
      express.static(this.config.get('STATIC_DIRECTORY_PATH')),
    );
    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
    this.expressApp.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.expressApp.use(cors());
  }

  public initExceptionFilters() {
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
    this.initRouters();
    this.initExceptionFilters();
    this.expressApp.listen(this.config.get('APP_PORT'));
    this.logger.info(`Server started on host: ${getFullServerPath(this.config.get('HOST'), this.config.get('APP_PORT'))}`);
  }
}

