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

// type ParamsFilmId = {
//   filmId: string;
// }

@injectable()
export default class FilmController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IFilmService) private filmService: IFilmService,
  ) {
    super(logger);

    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:filmId', method: HttpMethod.Patch, handler: this.update});
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

    this.created(res, fillResponse(FilmResponse, updatedFilm));
  }
}
