import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { ServiceError } from '../../types/service-error.enum.js';
import { createErrorObject } from '../../utils/common.js';
import { ILogger } from '../logger/logger.interface.js';
import { IExceptionFilter } from './exception-filter.interface.js';
import HttpError from './http-error.js';
import ValidationError from './validation-error.js';

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
      .json(createErrorObject(ServiceError.HttpError, error.message));
  }

  public validationErrorhandler(error: ValidationError, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(`[Validation Error]: ${error.message}`);
    error.details.forEach(
      (errorField) => this.logger.error(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(
        ServiceError.ValidationError,
        error.message,
        error.details
      ));
  }

  public otherErrorhandler(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.info(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ServiceError.ServiceError, error.message));
  }

  public catch(error: Error | HttpError | ValidationError, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.httpErrorhandler(error, req, res, next);
    }

    if (error instanceof ValidationError) {
      return this.validationErrorhandler(error, req, res, next);
    }

    this.otherErrorhandler(error, req, res, next);
  }
}
