import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { createErrorObject } from '../../utils/common.js';
import { ILogger } from '../logger/logger.interface.js';
import { IExceptionFilter } from './exception-filter.interface.js';
import HttpError from './http-error.js';

@injectable()
export default class ExceptionFilter implements IExceptionFilter {
  constructor(
    @inject(Component.ILogger) private logger: ILogger
  ) {
    this.logger.info('Register ExceptionFilter');
  }

  public httpErrorhandler(error: HttpError, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.info(`${error.detail}: ${error.httpStatusCode} - ${error.message}`);
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(error.message));
  }

  public otherErrorhandler(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.info(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(error.message));
  }

  public catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.httpErrorhandler(error, req, res, next);
    }

    this.otherErrorhandler(error, req, res, next);
  }
}
