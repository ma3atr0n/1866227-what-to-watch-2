import { DocumentType } from '@typegoose/typegoose';
import { IDocumentExists } from '../../types/document-exist.interface.js';
import { Genre } from '../../types/genre.enum.js';
import CreateFilmDTO from './dto/create-film.dto.js';
import UpdateFilmDTO from './dto/update-film.dto';
import { FilmEntity } from './film.entity.js';

export interface IFilmService extends IDocumentExists {
  create(dto: CreateFilmDTO): Promise<DocumentType<FilmEntity>>;
  updateById(filmId: string, dto: UpdateFilmDTO): Promise<DocumentType<FilmEntity> | null>;
  updateImageById(filmId: string, newFile: object): Promise<DocumentType<FilmEntity> | null>
  deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  findById(documentId: string): Promise<DocumentType<FilmEntity> | null>;
  findByName(name: string): Promise<DocumentType<FilmEntity> | null>;
  findOrCreate(dto: CreateFilmDTO): Promise<DocumentType<FilmEntity>>;
  find(limit?: number, userId?: string): Promise<DocumentType<FilmEntity>[]>;
  findByGenre(genre: keyof typeof Genre, userId: string, count?: number): Promise<DocumentType<FilmEntity>[]>;
  findDetails(filmId: string, userId: string): Promise<DocumentType<FilmEntity> | null>;
  findPromo(userId: string): Promise<DocumentType<FilmEntity> | null>;
  findAndChangeFavoriteStatus(filmId: string, status: 0 | 1): Promise<DocumentType<FilmEntity> | null>;
  findFavorites(): Promise<DocumentType<FilmEntity>[]>;
  findSimilar(filmId: string, genre: Genre, userId: string): Promise<DocumentType<FilmEntity>[]>;
}
