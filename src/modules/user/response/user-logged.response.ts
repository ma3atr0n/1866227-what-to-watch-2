import {Expose} from 'class-transformer';

export default class UserLoggedResponse {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;
}
