import typegoose, { getModelForClass, defaultClasses, Ref} from '@typegoose/typegoose';
import { injectable } from 'inversify';
import { FilmEntity } from '../film/film.entity.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface FavoriteEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'favorites'
  }
})

@injectable()
export class FavoriteEntity extends  defaultClasses.TimeStamps {
  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({
    ref: FilmEntity,
    required: true
  })
  public filmId!: Ref<FilmEntity>;
}

export const favoriteModel = getModelForClass(FavoriteEntity);
