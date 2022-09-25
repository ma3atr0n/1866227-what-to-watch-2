import { DocumentType } from '@typegoose/typegoose';
import CreateFilmDTO from './dto/create-film.dto.js';
import { FilmEntity } from './film.entity.js';

export interface IFilmService {
  create(dto: CreateFilmDTO): Promise<DocumentType<FilmEntity>>;
  findById(id: string): Promise<DocumentType<FilmEntity> | null>;
  findByName(name: string): Promise<DocumentType<FilmEntity> | null>;
  findOrCreate(dto: CreateFilmDTO): Promise<DocumentType<FilmEntity>>;
}
