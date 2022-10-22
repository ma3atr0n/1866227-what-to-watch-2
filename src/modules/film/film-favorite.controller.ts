import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { ILogger } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillResponse } from '../../utils/common.js';
import { IFilmService } from './film-service.interface.js';
import FilmResponse from './response/film.response.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import * as core from 'express-serve-static-core';
import ValidateObjectIdMiddelware from '../../common/middlewares/validate-objectid.middleware.js';


@injectable()
export default class FilmFavoriteController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IFilmService) private filmService: IFilmService,
  ) {
    super(logger);

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getFavorite});
    this.addRoute({
      path: '/:filmId/:status',
      method: HttpMethod.Post,
      handler: this.setFavorite,
      middlewares: [new ValidateObjectIdMiddelware('filmId')],
    });
  }

  public async getFavorite(
    _req: Request,
    res: Response
  ):Promise<void> {
    const favoriteFilms = await this.filmService.findFavorites();

    if (!favoriteFilms || favoriteFilms.length === 0) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'No Favorite films exist',
        'FilmFavoriteController'
      );
    }

    this.ok(res, fillResponse(FilmResponse, favoriteFilms));
  }

  public async setFavorite(
    {params}: Request<core.ParamsDictionary>,
    res: Response
  ):Promise<void> {
    const result = await this.filmService.findAndChangeFavoriteStatus(params.filmId, parseInt(params.status, 10) as 0 | 1);
    if (!result) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film with ID ${params.filmId} not exist`,
        'FilmFavoriteController'
      );
    }

    this.ok(res, fillResponse(FilmResponse, result));
  }
}
