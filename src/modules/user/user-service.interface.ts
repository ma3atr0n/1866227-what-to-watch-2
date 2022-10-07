import { DocumentType } from '@typegoose/typegoose';
import CreateUserDTO from './dto/create-user.dto.js';
import { UserEntity } from './user.entity.js';

export interface IUserService {
  create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findByID(id: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  find(): Promise<DocumentType<UserEntity>[]>;
}
