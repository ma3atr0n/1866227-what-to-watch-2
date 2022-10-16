import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import { IDocumentExists } from '../../types/document-exist.interface.js';
import { IMiddleware } from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';

export default class DocumentExistsMiddleware implements IMiddleware {
  constructor(
    private readonly service: IDocumentExists,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({params}: Request<ParamsDictionary>, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    const result = await this.service.exist(documentId);

    if (!result) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
