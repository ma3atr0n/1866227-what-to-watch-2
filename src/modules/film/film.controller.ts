import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { ILogger } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillResponse } from '../../utils/common.js';
import CreateFilmDTO from './dto/create-film.dto.js';
import { IFilmService } from './film-service.interface.js';
import FilmResponse from './response/film.response.js';
import * as core from 'express-serve-static-core';
import UpdateFilmDTO from './dto/update-film.dto.js';
import FilmShortResponse from './response/film-short.response.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { Genre } from '../../types/genre.enum.js';
import { RequestQuery } from '../../types/request-query.type.js';
import ValidateObjectIdMiddelware from '../../common/middlewares/validate-objectid.middleware.js';
import ValidateDTOMiddleware from '../../common/middlewares/validate-dto.middleware.js';
import DocumentExistsMiddleware from '../../common/middlewares/document-exist.middleware.js';
import PrivateRouteMiddleware from '../../common/middlewares/private-route.middleware.js';
import ValidateFilmOfUserMiddleware from '../../common/middlewares/validate-film-of-user.js';
import { ICommentService } from '../comment/comment-service.interface.js';


@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IFilmService) private filmService: IFilmService,
    @inject(Component.ICommentService) private commentService: ICommentService,
  ) {
    super(logger);

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(CreateFilmDTO),
      ],
    });
    this.addRoute({
      path: '/genre/:genre',
      method: HttpMethod.Get,
      handler: this.getByGenre
    });

    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Get,
      handler: this.getFilmDetails,
      middlewares: [
        new ValidateObjectIdMiddelware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'FilmEntity', 'filmId')
      ],
    });

    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddelware('filmId'),
        new ValidateDTOMiddleware(UpdateFilmDTO),
        new DocumentExistsMiddleware(this.filmService, 'FilmEntity', 'filmId'),
        new ValidateFilmOfUserMiddleware(this.filmService)
      ],
    });

    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Delete,
      handler: this.detele,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddelware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'FilmEntity', 'filmId'),
        new ValidateFilmOfUserMiddleware(this.filmService)
      ],
    });
  }

  public async index(
    {query, user}: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ):Promise<void> {
    const parsedLimit = parseInt(query.limit ?? '-1', 10);
    const result = await this.filmService.find(parsedLimit, user?.id);
    console.log(result);
    this.ok(res, fillResponse(FilmShortResponse, result));
  }

  public async create(
    {body, user}: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDTO>,
    res: Response
  ):Promise<void> {
    const result = await this.filmService.create({...body, userId: user.id});
    const newFilm = await this.filmService.findById(result.id);

    this.created(res, fillResponse(FilmResponse, newFilm));
  }

  public async getByGenre(
    {params, query, user}: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ):Promise<void> {
    const parsedLimit = parseInt(query.limit ?? '-1', 10);
    const result = await this.filmService.findByGenre(params.genre as Genre, user?.id, parsedLimit);

    this.ok(res, fillResponse(FilmShortResponse, result));
  }

  public async getFilmDetails(
    {params, user}: Request<core.ParamsDictionary>,
    res: Response
  ):Promise<void> {
    const existFilm = await this.filmService.findDetails(params.filmId, user?.id);

    if (!existFilm) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film with ID ${params.filmId} not exist`,
        'FilmController'
      );
    }
    console.log(existFilm);
    this.ok(res, fillResponse(FilmResponse, existFilm));
  }

  public async update(
    {body, params}:  Request<core.ParamsDictionary , Record<string, unknown>, UpdateFilmDTO>,
    res: Response
  ):Promise<void> {
    const updatedFilm = await this.filmService.updateById(params.filmId, body);

    const result = await this.filmService.findById(updatedFilm?.id);
    this.ok(res, fillResponse(FilmResponse, result));
  }

  public async detele(
    {params}:  Request<core.ParamsDictionary>,
    res: Response
  ):Promise<void> {
    const result = await this.filmService.deleteById(params.filmId);

    if (result) {
      await this.commentService.deleteByFilm(params.filmId);
    }

    this.ok(res, fillResponse(FilmResponse, result));
  }
}
