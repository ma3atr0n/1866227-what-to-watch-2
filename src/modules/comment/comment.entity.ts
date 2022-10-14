import typegoose, { getModelForClass, Ref } from '@typegoose/typegoose';
import { injectable } from 'inversify';
import { FilmEntity } from '../film/film.entity.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions } = typegoose;

export interface CommentEntity extends  typegoose.defaultClasses.Base {}

@modelOptions({ schemaOptions: { collection: 'comments' } })

@injectable()
export class CommentEntity extends typegoose.defaultClasses.TimeStamps {

  @prop({
    ref: FilmEntity,
    required: true,
  })
  public filmId!: Ref<FilmEntity>;

  @prop({
    required: true,
  })
  public comment!: string;

  @prop({
    required: true,
  })
  public rating!: number;

  @prop({
    required: false,
  })
  public date!: string;

  @prop({
    ref: UserEntity,
  })
  public userId!: Ref<UserEntity>;

}

export const commentModel = getModelForClass(CommentEntity);
