import { IMiddleware } from '../../types/middleware.interface.js';
import { validate } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import ValidationError from '../errors/validation-error.js';
import { transformErrors } from '../../utils/common.js';

export default class ValidateDTOMiddleware implements IMiddleware {
  constructor(
    private dto: ClassConstructor<object>
  ) {}

  public async execute({body, path}: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: "${path}"`, transformErrors(errors));
    }

    next();
  }
}
