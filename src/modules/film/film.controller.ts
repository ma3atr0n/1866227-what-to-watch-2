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

    this.addRoute({path: '/:count?', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/:genre/:count?', method: HttpMethod.Get, handler: this.getByGenre});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:filmId', method: HttpMethod.Patch, handler: this.update});
    this.addRoute({path: '/:filmId', method: HttpMethod.Delete, handler: this.detele});
  }

  // public async index(
  //   {params, query}: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
  //   res: Response
  // ) {
  //   let result;
  //   if (params.count) {
  //     result = await this.filmService.find(Number.parseInt(params.count, 10));
  //   } else {
  //     result = await this.filmService.find();
  //   }

  //   this.ok(res, fillResponse(FilmShortResponse, result));
  // }

  public async index(
    {query}: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ) {
    const result = await this.filmService.find(query.limit);

    this.ok(res, fillResponse(FilmShortResponse, result));
  }

  public async getByGenre(
    {params}: Request<core.ParamsDictionary>,
    res: Response
  ) {
    let result;
    if (params.count) {
      result = await this.filmService.findByGenre(params.genre as Genre, Number.parseInt(params.count, 10));
    } else {
      result = await this.filmService.findByGenre(params.genre as Genre);
    }

    this.ok(res, fillResponse(FilmShortResponse, result));
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDTO>,
    res: Response
  ) {
    const result = await this.filmService.create(body);
    const newFilm = await this.filmService.findById(result.id);

    this.created(res, fillResponse(FilmResponse, newFilm));
  }

  public async update(
    {body, params}:  Request<core.ParamsDictionary , Record<string, unknown>, UpdateFilmDTO>,
    res: Response
  ) {
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
  ) {
    const result = await this.filmService.deleteById(params.filmId);

    this.ok(res, fillResponse(FilmResponse, result));
  }
}
