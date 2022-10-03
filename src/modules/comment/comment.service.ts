import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { ICommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';

const DEFAULT_COMMENT_COUNT = 50;

@injectable()
export default class CommentService implements ICommentService {
  constructor(
    @inject(Component.ILogger) private logger: ILogger,
    @inject(Component.commentModel) private commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(filmId: string, dto: CreateCommentDTO): Promise<DocumentType<CommentEntity>> {
    const commentWithId = {
      ...dto,
      filmId
    };
    const result = await this.commentModel.create(commentWithId);
    this.logger.info('New comment created!');

    return result;
  }

  public async find(filmId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({filmId: filmId})
      .limit(DEFAULT_COMMENT_COUNT)
      .sort({date: -1})
      .exec();
  }
}
