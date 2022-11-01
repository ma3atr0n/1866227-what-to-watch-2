import chalk from 'chalk';
import { IDBClient } from '../common/database-client/database.interface.js';
import { DBClient } from '../common/database-client/database.service.js';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import ConcoleLoggerService from '../common/logger/console-logger.service.js';
import { ILogger } from '../common/logger/logger.interface.js';
import { IFilmService } from '../modules/film/film-service.interface.js';
import { filmModel } from '../modules/film/film.entity.js';
import { FilmService } from '../modules/film/film.service.js';
import { IUserService } from '../modules/user/user-service.interface.js';
import { userModel } from '../modules/user/user.entity.js';
import { UserService } from '../modules/user/user.service.js';
import { Film } from '../types/film.type.js';
import { createFilms } from '../utils/common.js';
import { getURI } from '../utils/db.js';
import { ICliCommand } from './cli-command.interface.js';

const DEFAULT_DB_PORT = 27017;
const DEFAULT_USER_PASSWORD = '123456';

export default class ImportCommand implements ICliCommand {
  public readonly name = '--import';

  private logger: ILogger;
  private DBClient!: IDBClient;
  private userService!: IUserService;
  private filmService!: IFilmService;
  private salt!: string;

  constructor () {
    this.onLine = this.onLine.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.logger = new ConcoleLoggerService();
    this.userService = new UserService(this.logger, userModel);
    this.filmService = new FilmService(this.logger, filmModel);
    this.DBClient = new DBClient(this.logger);
  }

  private async saveFilm(film: Film) {
    const user = await this.userService.findOrCreate({
      ...film.user,
      password: DEFAULT_USER_PASSWORD
    },
    this.salt);

    await this.filmService.findOrCreate({
      ...film,
      userId: user._id.toString()
    });
  }

  private async onLine(line: string, resolve: () => void) {
    const film = createFilms(line);
    await this.saveFilm(film);
    resolve();
  }

  private onEnd(count: number) {
    console.log(`${count} строк проимпортировано!`);
    this.DBClient.disconnect();
  }

  public async execute(filename: string, user: string, password: string, dbHost: string, dbName: string, salt: string): Promise<void> {
    const uri = getURI(user, password, dbHost, DEFAULT_DB_PORT, dbName);
    this.salt = salt;

    await this.DBClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onEnd);

    try {
      fileReader.read();
    } catch(err) {

      if (!(err instanceof Error)) {
        throw err;
      }
      console.log(chalk.hex('#DEADED').underline(`Не удалось импортировать данные из файла по причине: «${err.message}»`));
    }
  }
}
