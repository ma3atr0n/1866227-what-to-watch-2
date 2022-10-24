import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { DeleteResult } from 'mongodb';


export interface ICommentService {
  create(filmId: string, userId: string, dto: CreateCommentDTO): Promise<DocumentType<CommentEntity>>;
  find(filmId: string): Promise<DocumentType<CommentEntity>[]>;
  findById(commentId: string): Promise<DocumentType<CommentEntity> | null>;
  deleteByFilm(filmId: string): Promise<DeleteResult>;
}
