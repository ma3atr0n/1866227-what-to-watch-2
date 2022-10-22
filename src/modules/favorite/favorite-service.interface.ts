import { DocumentType } from '@typegoose/typegoose';
import { FavoriteEntity } from './favorite.entity.js';

export interface IFavoriteService {
  addOrDelete(userId: string, filmId: string, status: string): Promise<DocumentType<FavoriteEntity> | null>;
}
