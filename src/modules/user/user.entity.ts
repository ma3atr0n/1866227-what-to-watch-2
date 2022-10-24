import typegoose, { getModelForClass, defaultClasses} from '@typegoose/typegoose';
import { injectable } from 'inversify';
import { User } from '../../types/user.type.js';
import { createSHA256 } from '../../utils/common.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

@injectable()
export class UserEntity extends  defaultClasses.TimeStamps implements User {
  constructor(user: User) {
    super();

    this.userName = user.userName;
    this.email = user.email;
    this.avatarLink = user.avatarLink;
  }

  @prop({
    require: true,
    default: '',
    minLength: [1, 'User name min length is 1!'],
    maxLength: [15, 'User name max length is 15!'],
  })
  public userName!: string;

  @prop({
    require: true,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
  })
  public email!: string;

  @prop({
    default: ''
  })
  public avatarLink!: string;

  @prop({
    require: true,
    default: '',
    // minLength: [6, 'User password min length is 6!'],
    // maxLength: [12, 'User password max length is 12!'],
  })
  public password!: string;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public varifyPassword(password: string, salt: string) {
    const passwordHash = createSHA256(password, salt);
    return passwordHash === this.password;
  }
}

export const userModel = getModelForClass(UserEntity);
