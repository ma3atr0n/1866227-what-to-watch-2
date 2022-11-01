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
import { createJWT, fillResponse } from '../../utils/common.js';
import UserResponse from './response/user.response.js';
import HttpError from '../../common/errors/http-error.js';
import LoginDTO from './dto/login.dto.js';
import ValidateDTOMiddleware from '../../common/middlewares/validate-dto.middleware.js';
import UploadFileMiddleware from '../../common/middlewares/upload-file.middleware.js';
import ValidateObjectIdMiddelware from '../../common/middlewares/validate-objectid.middleware.js';
import DocumentExistsMiddleware from '../../common/middlewares/document-exist.middleware.js';
import { DEFAULT_AVATAR_FILE_NAME, JWT_ALGORITM } from './user.constant.js';
import UserLoggedResponse from './response/user-logged.response.js';
import PrivateRouteMiddleware from '../../common/middlewares/private-route.middleware.js';
import PublicRouteMiddleware from '../../common/middlewares/public-route.middleware copy.js';
import UploadUserAvatarResponse from './response/upload-user-avatar.response.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IConfig) config: IConfig,
    @inject(Component.IUserService) private userService: IUserService,
  ) {
    super(logger, config);

    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDTOMiddleware(LoginDTO)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      middlewares: [
        new PrivateRouteMiddleware(),
      ],
    });
    this.addRoute({path: '/logout', method: HttpMethod.Delete, handler: this.logout});
    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PublicRouteMiddleware(),
        new ValidateDTOMiddleware(CreateUserDTO)
      ]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.upload,
      middlewares: [
        new ValidateObjectIdMiddelware('userId'),
        new DocumentExistsMiddleware(this.userService, 'UserEntity', 'userId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginDTO>,
    res: Response
  ): Promise<void> {
    const authUser = await this.userService.varifyUser(body, this.config.get('SALT'));

    if(!authUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email: ${body.email} unauthorized`,
        'userController'
      );
    }

    const jwtToken = await createJWT(JWT_ALGORITM, this.config.get('JWT_SECRET'), {id: authUser._id, email: authUser.email});

    this.ok(res, fillResponse(UserLoggedResponse, {token: jwtToken, email: authUser.email}));
  }

  public async checkAuthenticate(
    req: Request,
    res: Response,
  ): Promise<void> {
    const existUser = await this.userService.findByEmail(req.user.email);

    if (!existUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email: ${req.user.email} not found`,
        'userController'
      );
    }

    this.ok(res, fillResponse(UserResponse, existUser));
  }

  public async logout(
    _req: Request,
    res: Response
  ): Promise<void> {

    this.ok(res, {message: 'Logged out successfully'});
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDTO>,
    res: Response
  ): Promise<void> {
    const existUser = await this.userService.findByEmail(body.email);

    if (existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email: ${body.email} exist.`,
        'userController'
      );
    }

    const result = await this.userService.create({...body, avatarLink: DEFAULT_AVATAR_FILE_NAME}, this.config.get('SALT'));
    this.created(res, fillResponse(UserResponse, result));
  }

  public async upload(req: Request, res: Response) {
    const { userId } = req.params;
    const updateDTO = {avatarLink: req.file === undefined ? DEFAULT_AVATAR_FILE_NAME : req.file.filename};
    const result = await this.userService.updateById(userId, updateDTO);

    this.created(res, fillResponse(UploadUserAvatarResponse, result));
  }
}
