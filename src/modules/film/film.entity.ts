import typegoose, { defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import { injectable } from 'inversify';
import { Genre } from '../../types/genre.enum.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions } = typegoose;

export interface FilmEntity extends defaultClasses.Base {}


@modelOptions({ schemaOptions: { collection: 'films' } })

@injectable()
export class FilmEntity extends defaultClasses.TimeStamps {
  @prop({
    required:true,
    default: '',
    minLength: [2, 'Film name min length is 2!'],
    maxLength: [100, 'Film name max length is 100!'],
  })
  public name!: string;

  @prop({
    required:true,
    default: '',
    minLength: [20, 'Description min length is 20!'],
    maxLength: [1024, 'Description max length is 1042!'],
  })
  public description!: string;

  @prop({
    required:true,
    default: new Date,
  })
  public releaseDate!: string;

  @prop({
    type: () => String,
    enum: Genre
  })
  public genre!: keyof typeof Genre;

  @prop({
    required:true,
    default: 9999,
  })
  public year!: number;

  @prop({
    required:true,
    default: '',
  })
  public previewVideoLink!: string;

  @prop({
    required:true,
    default: '',
  })
  public videoLink!: string;

  @prop({
    type: () => [String],
    required:true,
    default: [],
  })
  public starrings!: string[];

  @prop({
    required:true,
    default: '',
    minLength: [2, 'Director min length is 2!'],
    maxLength: [50, 'Director max length is 50!'],
  })
  public director!: string;

  @prop({
    required:true,
    default: 0,
  })
  public runTime!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({
    required:true,
    validate: {
      validator: (posterLink: string) => posterLink.endsWith('.jpg'),
      message: 'Poster is not JPG file!'
    }
  })
  public posterLink!: string;

  @prop({
    required:true,
    validate: {
      validator: (bgLink: string) => bgLink.endsWith('.jpg'),
      message: 'Background image is not JPG file!'
    }
  })
  public bgLink!: string;

  @prop({
    required:true
  })
  public bgColor!: string;

  @prop({
    required: true,
    default: false,
  })
  public isFavorite!: boolean;

}

export const filmModel = getModelForClass(FilmEntity);
