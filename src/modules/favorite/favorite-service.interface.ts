import { DocumentType } from '@typegoose/typegoose';
import { FilmEntity } from '../film/film.entity.js';
import { FavoriteEntity } from './favorite.entity.js';

export interface IFavoriteService {
  addOrDelete(userId: string, filmId: string, status: string): Promise<DocumentType<FavoriteEntity> | null>;
  find(userId?: string): Promise<DocumentType<FilmEntity>[]>;
}
