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


@injectable()
export default class FavoriteController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IFavoriteService) private favoriteService: IFavoriteService,
  ) {
    super(logger);

    this.addRoute({path: '/:filmId/:userId/:flag', method: HttpMethod.Post, handler: this.create});
  }

  public async create(
    {params}: Request<core.ParamsDictionary>,
    res: Response
  ):Promise<void> {
    const {userId, filmId, flag} = params;

    const result = await this.favoriteService.addOrDelete(userId, filmId, flag);

    if (!result) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Film with ID ${filmId} can't be added to favorite or deleted`,
        'FavoriteController'
      );
    }

    this.ok(res, fillResponse(AddOrDeleteFavoriteResponse, result));
  }
}
