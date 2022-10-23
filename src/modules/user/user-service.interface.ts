import { DocumentType } from '@typegoose/typegoose';
import { IDocumentExists } from '../../types/document-exist.interface.js';
import CreateUserDTO from './dto/create-user.dto.js';
import LoginDTO from './dto/login.dto.js';
import { UserEntity } from './user.entity.js';

export interface IUserService extends IDocumentExists {
  create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findByID(id: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  find(): Promise<DocumentType<UserEntity>[]>;
  varifyUser(dto: LoginDTO, salt: string): Promise<DocumentType<UserEntity> | null>
}
