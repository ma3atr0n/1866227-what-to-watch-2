import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import CreateUserDTO from './dto/create-user.dto.js';
import { IUserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(Component.ILogger) private logger: ILogger,
    @inject(Component.userModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new this.userModel(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email}).exec();
  }

  public async findByID(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id).exec();
  }

  public async findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const existUser = await this.findByEmail(dto.email);

    if (existUser) {
      return existUser;
    }

    return this.create(dto, salt);
  }

  public async find(): Promise<DocumentType<UserEntity>[]> {
    return this.userModel.find().exec();
  }
}
