import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { ILogger } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import * as core from 'express-serve-static-core';
import { IFavoriteService } from './favorite-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import AddOrDeleteFavoriteResponse from './response/favorite.response.js';
import { fillResponse } from '../../utils/common.js';
import PrivateRouteMiddleware from '../../common/middlewares/private-route.middleware.js';
import FilmShortResponse from '../film/response/film-short.response.js';
import { IFilmService } from '../film/film-service.interface.js';
import DocumentExistsMiddleware from '../../common/middlewares/document-exist.middleware.js';
import ValidateObjectIdMiddelware from '../../common/middlewares/validate-objectid.middleware.js';
import { IConfig } from '../../common/config/config.interface.js';


@injectable()
export default class FavoriteController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IConfig) config: IConfig,
    @inject(Component.IFavoriteService) private favoriteService: IFavoriteService,
    @inject(Component.IFilmService) private filmService: IFilmService,
  ) {
    super(logger, config);

    this.addRoute({
      path: '/:filmId/:flag',
      method: HttpMethod.Post,
      handler: this.addOrDelete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddelware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'FilmEntity', 'filmId'),
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
  }

  public async addOrDelete(
    {params, user}: Request<core.ParamsDictionary>,
    res: Response
  ):Promise<void> {
    const {filmId, flag} = params;

    const result = await this.favoriteService.addOrDelete(user.id, filmId, flag);

    if (!result) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Film with ID ${filmId} can't be added to favorite or deleted`,
        'FavoriteController'
      );
    }

    this.ok(res, fillResponse(AddOrDeleteFavoriteResponse, result));
  }

  public async index(
    { user }: Request,
    res: Response
  ):Promise<void> {
    const result = await this.favoriteService.find(user.id);

    this.ok(res, fillResponse(FilmShortResponse, result));
  }
}
