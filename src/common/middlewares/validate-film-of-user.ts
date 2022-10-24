import { IMiddleware } from '../../types/middleware.interface.js';
import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { IFilmService } from '../../modules/film/film-service.interface.js';

export default class ValidateFilmOfUserMiddleware implements IMiddleware {
  constructor(
    private readonly filmService: IFilmService,
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {

    const result = await this.filmService.findById(req.params.filmId);

    if (result && result.userId && result.userId.toString() !== req.user.id) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film with ID: ${req.params.filmId} and Name: ${result.name} created by another User, you can'y modify or delete it`,
        'ValidateFilmOfUserMiddleware'
      );
    }

    return next();
  }
}
