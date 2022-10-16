import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { IMiddleware } from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';

export default class ValidateObjectIdMiddelware implements IMiddleware {
  constructor(
    private paramName: string
  ) {}

  public execute({params}: Request<ParamsDictionary>, _res: Response, next: NextFunction): void {
    const objectId = params[this.paramName];

    if (!Types.ObjectId.isValid(objectId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Parameter: ${this.paramName} with value: ${params[this.paramName]} is not valid ObjectID`,
        'ValidateObjectIdMiddleware'
      );
    }

    next();
  }
}
