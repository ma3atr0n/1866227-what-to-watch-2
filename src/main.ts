import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import Application from './app/application.js';
import { IConfig } from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';
import { IController } from './common/controller/controller.interface.js';
import { IDBClient } from './common/database-client/database.interface.js';
import { DBClient } from './common/database-client/database.service.js';
import { IExceptionFilter } from './common/errors/exception-filter.interface.js';
import ExceptionFilter from './common/errors/exception-filter.js';
import { ILogger } from './common/logger/logger.interface.js';
import { LoggerService } from './common/logger/logger.service.js';
import { ICommentService } from './modules/comment/comment-service.interface.js';
import CommentController from './modules/comment/comment.controller.js';
import { CommentEntity, commentModel } from './modules/comment/comment.entity.js';
import CommentService from './modules/comment/comment.service.js';
import { IFavoriteService } from './modules/favorite/favorite-service.interface.js';
import favoriteController from './modules/favorite/favorite.controller.js';
import { FavoriteEntity, favoriteModel } from './modules/favorite/favorite.entity.js';
import { FavoriteService } from './modules/favorite/favorite.service.js';
import FilmPromoController from './modules/film/film-promo.controller.js';
import { IFilmService } from './modules/film/film-service.interface.js';
import FilmController from './modules/film/film.controller.js';
import { FilmEntity, filmModel } from './modules/film/film.entity.js';
import { FilmService } from './modules/film/film.service.js';
import { IUserService } from './modules/user/user-service.interface.js';
import UserController from './modules/user/user.controller.js';
import { UserEntity, userModel } from './modules/user/user.entity.js';
import { UserService } from './modules/user/user.service.js';
import { Component } from './types/component.types.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<ILogger>(Component.ILogger).to(LoggerService).inSingletonScope();
applicationContainer.bind<IConfig>(Component.IConfig).to(ConfigService).inSingletonScope();
applicationContainer.bind<IDBClient>(Component.IDBClient).to(DBClient).inSingletonScope();
applicationContainer.bind<IUserService>(Component.IUserService).to(UserService);
applicationContainer.bind<types.ModelType<UserEntity>>(Component.userModel).toConstantValue(userModel);
applicationContainer.bind<IFilmService>(Component.IFilmService).to(FilmService);
applicationContainer.bind<types.ModelType<FilmEntity>>(Component.filmModel).toConstantValue(filmModel);
applicationContainer.bind<ICommentService>(Component.ICommentService).to(CommentService);
applicationContainer.bind<types.ModelType<CommentEntity>>(Component.commentModel).toConstantValue(commentModel);
applicationContainer.bind<types.ModelType<FavoriteEntity>>(Component.favoriteModel).toConstantValue(favoriteModel);
applicationContainer.bind<IFavoriteService>(Component.IFavoriteService).to(FavoriteService);

applicationContainer.bind<IExceptionFilter>(Component.IExceptionFilter).to(ExceptionFilter);
applicationContainer.bind<IController>(Component.userController).to(UserController);
applicationContainer.bind<IController>(Component.filmController).to(FilmController);
applicationContainer.bind<IController>(Component.filmPromoController).to(FilmPromoController);
applicationContainer.bind<IController>(Component.favoriteController).to(favoriteController);
applicationContainer.bind<IController>(Component.commentController).to(CommentController);

const application = applicationContainer.get<Application>(Component.Application);
await application.init();


