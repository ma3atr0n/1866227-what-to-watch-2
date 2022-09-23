import { Container } from 'inversify';
import Application from './app/application.js';
import { IConfig } from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';
import { IDBClient } from './common/database-client/database.interface.js';
import { DBClient } from './common/database-client/database.service.js';
import { ILogger } from './common/logger/logger.interface.js';
import { LoggerService } from './common/logger/logger.service.js';
import { Component } from './types/component.types.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<ILogger>(Component.ILogger).to(LoggerService).inSingletonScope();
applicationContainer.bind<IConfig>(Component.IConfig).to(ConfigService).inSingletonScope();
applicationContainer.bind<IDBClient>(Component.IDBClient).to(DBClient).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);
await application.init();


