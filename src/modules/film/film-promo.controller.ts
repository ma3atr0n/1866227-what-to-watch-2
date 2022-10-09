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


@injectable()
export default class FilmPromoController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IFilmService) private filmService: IFilmService,
  ) {
    super(logger);

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getPromo});
  }

  public async getPromo(
    _req: Request,
    res: Response
  ):Promise<void> {
    const promoFilm = await this.filmService.findPromo();

    if (!promoFilm) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Promo film not exist',
        'FilmPromoController'
      );
    }

    this.ok(res, fillResponse(FilmResponse, promoFilm));
  }
}
