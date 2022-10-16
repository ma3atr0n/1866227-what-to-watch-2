import { types } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { Genre } from '../../types/genre.enum.js';
import CreateFilmDTO from './dto/create-film.dto.js';
import { IFilmService } from './film-service.interface.js';
import { FilmEntity } from './film.entity.js';
import { Types } from 'mongoose';
import UpdateFilmDTO from './dto/update-film.dto.js';

const DEFAULT_FILM_LIMIT = 60;

@injectable()
export class FilmService implements IFilmService {
  constructor(
    @inject(Component.ILogger) private logger: ILogger,
    @inject(Component.filmModel) private filmModel: types.ModelType<FilmEntity>,
  ) {}

  public async create(dto: CreateFilmDTO): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.name}`);

    return result;
  }

  public async updateById(filmId: string, dto: UpdateFilmDTO): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndUpdate(filmId, dto, {new: true})
      .populate('userId')
      .exec();
  }

  public async deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel
      .findByIdAndDelete(filmId)
      .populate('userId')
      .exec();
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity>> {
    return (await this.filmModel
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
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: {
          path :'$user',
          preserveNullAndEmptyArrays: true}
        },
        {
          $addFields: {
            commentCount: { $size: '$comments'}, rating: { $avg: '$comments.rating'}
          }
        },
        { $unset: 'comments' },
        { $sort: { releaseDate: -1 } },
      ]).exec())[0];
  }

  public async findByName(name: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({name}).exec();
  }

  public async findOrCreate(dto: CreateFilmDTO): Promise<DocumentType<FilmEntity>> {
    const existedFilm = await this.findByName(dto.name);

    if (existedFilm) {
      return existedFilm;
    }

    return this.create(dto);
  }

  public async find(limit?: number): Promise<DocumentType<FilmEntity>[]> {
    const parsedLimit = limit && limit > 0 ? limit : DEFAULT_FILM_LIMIT;
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
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: {
          path :'$user',
          preserveNullAndEmptyArrays: true}
        },
        {
          $addFields: {
            commentCount: { $size: '$comments'}, rating: { $avg: '$comments.rating'}
          }
        },
        { $unset: 'comments' },
        { $limit: parsedLimit },
        { $sort: { releaseDate: -1 } },
      ]).exec();
  }

  public async findByGenre(genre: keyof typeof Genre, limit?: number): Promise<DocumentType<FilmEntity>[]> {
    const result = await this.find(limit);

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
    const result = await this.find();

    return result[0];
  }

  public async findAndChangeFavoriteStatus(filmId: string, status: 0 | 1): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findByIdAndUpdate(filmId, {isFavorite: status}, {new: true}).exec();
  }

  public async findFavorites(): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel
      .aggregate([
        {$match: {isFavorite: true}},
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
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: {
          path :'$user',
          preserveNullAndEmptyArrays: true}
        },
        {
          $addFields: {
            commentCount: { $size: '$comments'}, rating: { $avg: '$comments.rating'}
          }
        },
        { $unset: 'comments' },
        { $sort: { releaseDate: -1 } },
      ]).exec();
  }

  public async exist(documentId: string): Promise<boolean> {
    return (await this.filmModel.exists({_id: documentId})) !== null;
  }
}
