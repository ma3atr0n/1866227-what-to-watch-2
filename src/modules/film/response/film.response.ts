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
  public starring!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public runTime!: number;

  @Expose()
  public posterLink!: number;

  @Expose()
  public bgLink!: number;

  @Expose()
  public bgColor!: number;

  @Expose()
  public commentCount!: number;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;
}
