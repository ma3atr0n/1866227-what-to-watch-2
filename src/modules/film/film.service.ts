import { types } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { Genre } from '../../types/genre.enum.js';
import createFilmDto from './dto/create-film.dto.js';
import { IFilmService } from './film-service.interface.js';
import { FilmEntity } from './film.entity.js';
import { Types } from 'mongoose';

const DEFAULT_FILM_LIMIT = 60;

@injectable()
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

  public async updateById(filmId: string, dto: createFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, dto, {new: true})
      .populate(['user'])
      .exec();
  }

  public async deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndDelete(filmId)
      .exec();
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findById(filmId).exec();
  }

  public async findByName(name: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({name}).exec();
  }

  public async findOrCreate(dto: createFilmDto): Promise<DocumentType<FilmEntity>> {
    const existedFilm = await this.findByName(dto.name);

    if (existedFilm) {
      return existedFilm;
    }

    return this.create(dto);
  }

  public async find(count?: number): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'filmId',
            as: 'comments'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            pipeline: [
              { $project: { userName: 1, email: 1, avatarLink: 1, password: 1}}
            ],
            as: 'user'
          }
        },
        { $unwind: {
          path :'$user',
          preserveNullAndEmptyArrays: true}
        },
        {
          $addFields: {
            id: { $toString: '$_id'}, commentCount: { $size: '$comments'}
          }
        },
        { $unset: 'comments' },
        { $limit: count ?? DEFAULT_FILM_LIMIT },
        { $sort: { releaseDate: -1 } },
        { $project: {id: 1, name: 1, releaseDate: 1, genre: 1, previewVideoLink: 1, user: 1, posterLink: 1, commentCount: 1}},
      ]).exec();
  }

  public async findByGenre(genre: keyof typeof Genre): Promise<DocumentType<FilmEntity>[]> {
    const result = await this.find();

    return result.filter((elem) => elem.genre === genre);
  }

  public async findDetails(filmId: string): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel
      .aggregate([
        {$match:{ _id: new Types.ObjectId(filmId)}},
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'filmId',
            as: 'comments'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            pipeline: [
              { $project: { userName: 1, email: 1, avatarLink: 1, password: 1}}
            ],
            as: 'user'
          }
        },
        { $unwind: {
          path :'$user',
          preserveNullAndEmptyArrays: true}
        },
        {
          $addFields: {
            id: { $toString: '$_id'}, commentCount: { $size: '$comments'}, rating: { $avg: '$comments.rating'}
          }
        },
        { $unset: 'comments' },
        { $sort: { releaseDate: -1 } },
      ]).exec();
  }

  public async findPromo(): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({}).sort({ releaseDate: -1 }).exec();
  }

  public async findAndChangeFavoriteStatus(filmId: string, status: 0 | 1): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findByIdAndUpdate(filmId, {isFavorite: status}, {new: true}).exec();
  }

  public async findFavorites(): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel.find({isFavorite: true}).exec();
  }
}
