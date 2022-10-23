import { IMiddleware } from '../../types/middleware.interface.js';
import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export default class PrivateRouteMiddleware implements IMiddleware {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'You are not authorized to this page',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
