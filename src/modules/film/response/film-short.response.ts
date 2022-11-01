import {Expose, Type} from 'class-transformer';
import { Genre } from '../../../types/genre.enum.js';
import UserResponse from '../../user/response/user.response.js';

export default class FilmShortResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public releaseDate!: string;

  @Expose()
  public genre!: keyof typeof Genre;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public posterLink!: string;

  @Expose()
  public commentCount!: number;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;
}
