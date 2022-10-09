import { Router, Response } from 'express';
import { IRoute } from '../../types/route.interface.js';
import { ILogger } from '../logger/logger.interface.js';
import { IController } from './controller.interface.js';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import asyncHandler from 'express-async-handler';

@injectable()
export abstract class Controller implements IController {
  private _router: Router;

  constructor(protected readonly logger: ILogger) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: IRoute): void {
    this._router[route.method](route.path, asyncHandler(route.handler.bind(this)));
    this.logger.info(`Route ${route.method } ${route.path} was added!`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
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
