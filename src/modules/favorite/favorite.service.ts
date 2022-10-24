import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { Component } from '../../types/component.types.js';
import { FilmEntity } from '../film/film.entity.js';
import { IFavoriteService } from './favorite-service.interface.js';
import { FavoriteEntity } from './favorite.entity.js';

@injectable()
export class FavoriteService implements IFavoriteService {
  constructor(
    @inject(Component.favoriteModel) private favoriteModel: types.ModelType<FavoriteEntity>,
    @inject(Component.filmModel) private filmModel: types.ModelType<FilmEntity>,
  ) {}

  public async addOrDelete(userId: string, filmId: string, status: string): Promise<DocumentType<FavoriteEntity> | null> {
    const existFavorite = await this.favoriteModel.findOne({userId, filmId});

    if (status === '0' && existFavorite) {
      return this.favoriteModel.findByIdAndDelete(existFavorite?._id, {new: true}).exec();
    }
    if (status === '1' && !existFavorite) {
      return this.favoriteModel.create({userId, filmId});
    }
    return null;
  }

  public async find(userId?: string): Promise<DocumentType<FilmEntity>[]> {
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
        {
          $lookup: {
            from: 'favorites',
            let: {userId: new Types.ObjectId(userId), filmId: '$_id'},
            pipeline: [
              { $match:
                 { $expr:
                    { $and:
                       [
                         { $eq: [ '$filmId',  '$$filmId' ] },
                         { $eq: [ '$userId', '$$userId' ] }
                       ]
                    }
                 }
              }
            ],
            as: 'favorites'
          }
        },
        {
          $addFields: {
            isFavorite: {
              $switch:{
                branches: [
                  {
                    case: { $gt : [ { $size : '$favorites' }, 0 ] },
                    then: true
                  }
                ],
                default: false
              }
            }
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
        { $unset: ['comments', 'favorites']},
        { $match: { 'isFavorite': true}},
        { $sort: { releaseDate: -1 } },
      ]).exec();
  }

}
