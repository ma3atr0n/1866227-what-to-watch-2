import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { ILogger } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { ICommentService } from './comment-service.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';
import { fillResponse } from '../../utils/common.js';
import CommentResponse from './response/comment.response.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import ValidateObjectIdMiddelware from '../../common/middlewares/validate-objectid.middleware.js';
import ValidateDTOMiddleware from '../../common/middlewares/validate-dto.middleware.js';
import { IFilmService } from '../film/film-service.interface.js';
import DocumentExistsMiddleware from '../../common/middlewares/document-exist.middleware.js';
import PrivateRouteMiddleware from '../../common/middlewares/private-route.middleware.js';
import { IConfig } from '../../common/config/config.interface.js';

export type ParamsGetComments = {
  filmId: string
}

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IConfig) config: IConfig,
    @inject(Component.ICommentService) private commentService: ICommentService,
    @inject(Component.IFilmService) private filmService: IFilmService,
  ) {
    super(logger, config);

    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddelware('filmId'),
        new DocumentExistsMiddleware(this.filmService, 'FilmEntity', 'filmId')
      ],
    });
    this.addRoute({
      path: '/:filmId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddelware('filmId'),
        new ValidateDTOMiddleware(CreateCommentDTO),
        new DocumentExistsMiddleware(this.filmService, 'FilmEntity', 'filmId')
      ]
    });
  }

  public async index(
    {params}: Request<core.ParamsDictionary | ParamsGetComments>,
    res: Response
  ):  Promise<void> {
    const comments = await this.commentService.find(params.filmId);

    this.ok(res, fillResponse(CommentResponse, comments));
  }

  public async create(
    {body, params, user}: Request<core.ParamsDictionary | ParamsGetComments, Record<string, unknown>, CreateCommentDTO>,
    res: Response
  ):  Promise<void> {
    const result = await this.commentService.create(params.filmId, user.id, body);
    const newComment = await this.commentService.findById(result.id);

    this.created(res, fillResponse(CommentResponse, newComment));
  }

}
