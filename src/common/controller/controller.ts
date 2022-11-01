import { Router, Response } from 'express';
import { IRoute } from '../../types/route.interface.js';
import { ILogger } from '../logger/logger.interface.js';
import { IController } from './controller.interface.js';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import asyncHandler from 'express-async-handler';
import { UnknownObject } from '../../types/unknown-object.type.js';
import { getFullServerPath, transformObject } from '../../utils/common.js';
import { STATIC_RESOURCE_FIELDS } from '../../app/application.constant.js';
import { IConfig } from '../config/config.interface.js';

@injectable()
export abstract class Controller implements IController {
  private _router: Router;

  constructor(
    protected readonly logger: ILogger,
    protected readonly config: IConfig,
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: IRoute): void {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map((middleware) => asyncHandler(middleware.execute.bind(middleware)));

    const allHendlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this._router[route.method](route.path, allHendlers);
    this.logger.info(`Route ${route.method } ${route.path} was added!`);
  }

  protected addStaticPath(data: UnknownObject): void {
    transformObject(
      STATIC_RESOURCE_FIELDS,
      `${getFullServerPath(this.config.get('HOST'), this.config.get('APP_PORT'))}/static`,
      `${getFullServerPath(this.config.get('HOST'), this.config.get('APP_PORT'))}/upload`,
      data
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(data as UnknownObject);
    res
      .status(statusCode)
      .contentType('application/json')
      .json(data);
  }

  public ok<T>(res: Response, data: T) {
    this.send(res, StatusCodes.OK , data);
  }

  public created<T>(res: Response, data: T) {
    this.send(res, StatusCodes.CREATED , data);
  }

  public noContent<T>(res: Response, data: T) {
    this.send(res, StatusCodes.NO_CONTENT , data);
  }
}
