import { IMiddleware } from '../../types/middleware.interface.js';
import { validate } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export default class ValidateDTOMiddleware implements IMiddleware {
  constructor(
    private dto: ClassConstructor<object>
  ) {}

  public async execute({body}: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(errors);
      return;
    }

    next();
  }
}
