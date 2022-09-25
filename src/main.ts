import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import Application from './app/application.js';
import { IConfig } from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';
import { IDBClient } from './common/database-client/database.interface.js';
import { DBClient } from './common/database-client/database.service.js';
import { ILogger } from './common/logger/logger.interface.js';
import { LoggerService } from './common/logger/logger.service.js';
import { IFilmService } from './modules/film/film-service.interface.js';
import { FilmEntity, filmModel } from './modules/film/film.entity.js';
import { FilmService } from './modules/film/film.service.js';
import { IUserService } from './modules/user/user-service.interface.js';
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

const application = applicationContainer.get<Application>(Component.Application);
await application.init();


