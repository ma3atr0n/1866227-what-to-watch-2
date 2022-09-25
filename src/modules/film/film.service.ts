import { types } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { inject } from 'inversify';
import { ILogger } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import createFilmDto from './dto/create-film.dto.js';
import { IFilmService } from './film-service.interface.js';
import { FilmEntity } from './film.entity.js';


export class FilmService implements IFilmService {
  constructor(
    @inject(Component.ILogger) private logger: ILogger,
    @inject(Component.filmModel) private filmModel: types.ModelType<FilmEntity>,
  ) {}

  public async create(dto: createFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.name}`);

    return result;
  }

  public async findById(id: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findById(id).exec();
  }

  public async findByName(name: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({name}).exec();
  }

  public async findOrCreate(dto: createFilmDto): Promise<types.DocumentType<FilmEntity>> {
    const existedFilm = await this.findByName(dto.name);

    if (existedFilm) {
      return existedFilm;
    }

    return this.create(dto);
  }
}
