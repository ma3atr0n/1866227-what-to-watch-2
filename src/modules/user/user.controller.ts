import { Controller } from '../../common/controller/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { ILogger } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import { IUserService } from './user-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import CreateUserDTO from './dto/create-user.dto.js';
import { IConfig } from '../../common/config/config.interface.js';
import { fillResponse } from '../../utils/common.js';
import UserResponse from './response/user.response.js';
import HttpError from '../../common/errors/http-error.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IUserService) private userService: IUserService,
    @inject(Component.IConfig) private config: IConfig,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController...');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
  }

  public async index(_req: Request, res: Response) {
    const result = await this.userService.find();
    this.send(res, StatusCodes.OK, result);
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDTO>, res: Response): Promise<void> {
    const existUser = await this.userService.findByEmail(body.email);

    if (existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email: ${body.email} exist.`,
        'userController'
      );
    }

    const result = await this.userService.create(body, this.config.get('SALT'),);
    this.created(res, fillResponse(UserResponse, result));
  }
}
