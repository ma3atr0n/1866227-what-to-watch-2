import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { IFavoriteService } from './favorite-service.interface.js';
import { FavoriteEntity } from './favorite.entity.js';

@injectable()
export class FavoriteService implements IFavoriteService {
  constructor(
    @inject(Component.favoriteModel) private favoriteModel: types.ModelType<FavoriteEntity>,
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

}
