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


@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IFilmService) private filmService: IFilmService,
  ) {
    super(logger);

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/genre/:genre', method: HttpMethod.Get, handler: this.getByGenre});
    this.addRoute({path: '/:filmId', method: HttpMethod.Get, handler: this.getFilmDetails});
    this.addRoute({path: '/:filmId', method: HttpMethod.Patch, handler: this.update});
    this.addRoute({path: '/:filmId', method: HttpMethod.Delete, handler: this.detele});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.getPromo});
  }

  public async index(
    {query}: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ):Promise<void> {
    const parsedLimit = parseInt(query.limit ?? '-1', 10);
    const result = await this.filmService.find(parsedLimit);

    this.ok(res, fillResponse(FilmShortResponse, result));
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDTO>,
    res: Response
  ):Promise<void> {
    const result = await this.filmService.create(body);
    const newFilm = await this.filmService.findById(result.id);

    this.created(res, fillResponse(FilmResponse, newFilm));
  }

  public async getByGenre(
    {params, query}: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ):Promise<void> {
    const parsedLimit = parseInt(query.limit ?? '-1', 10);
    const result = await this.filmService.findByGenre(params.genre as Genre, parsedLimit);

    this.ok(res, fillResponse(FilmShortResponse, result));
  }

  public async getFilmDetails(
    {params}: Request<core.ParamsDictionary>,
    res: Response
  ):Promise<void> {
    const existFilm = await this.filmService.findById(params.filmId);

    if (!existFilm) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film with ID ${params.filmId} not exist`,
        'FilmController'
      );
    }

    this.ok(res, fillResponse(FilmResponse, existFilm));
  }

  public async update(
    {body, params}:  Request<core.ParamsDictionary , Record<string, unknown>, UpdateFilmDTO>,
    res: Response
  ):Promise<void> {
    const updatedFilm = await this.filmService.updateById(params.filmId, body);
    if (!updatedFilm) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film with ID: ${params.filmId} not found`,
        'FilmController'
      );
    }
    console.log(updatedFilm);
    const result = await this.filmService.findById(updatedFilm.id);
    console.log(result);
    this.ok(res, fillResponse(FilmResponse, result));
  }

  public async detele(
    {params}:  Request<core.ParamsDictionary>,
    res: Response
  ):Promise<void> {
    const result = await this.filmService.deleteById(params.filmId);

    this.ok(res, fillResponse(FilmResponse, result));
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
        'FilmController'
      );
    }

    this.ok(res, fillResponse(FilmResponse, promoFilm));
  }
}
