import {Expose, Type} from 'class-transformer';
import { Genre } from '../../../types/genre.enum.js';
import UserResponse from '../../user/response/user.response.js';

export default class FilmResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose()
  public releaseDate!: string;

  @Expose()
  public genre!: keyof typeof Genre;

  @Expose()
  public year!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public videoLink!: string;

  @Expose()
  public starrings!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public runTime!: number;

  @Expose()
  public posterLink!: string;

  @Expose()
  public bgLink!: string;

  @Expose()
  public bgColor!: string;

  @Expose()
  public commentCount!: number;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;
}
