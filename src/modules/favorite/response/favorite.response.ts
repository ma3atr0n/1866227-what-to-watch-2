import {Expose} from 'class-transformer';

export default class AddOrDeleteFavoriteResponse {
  @Expose()
  public userId!: string;

  @Expose()
  public filmId!: string;
}
