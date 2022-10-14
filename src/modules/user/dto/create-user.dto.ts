import {MaxLength, MinLength, IsString, Matches, IsOptional} from 'class-validator';

export default class CreateUserDTO {
  @MinLength(1, {message: 'User name is too short. Minimal length is $constraint1 characters, but actual is $value'})
  @MaxLength(15, {message: 'User name is too long. Minimal length is $constraint1 characters, but actual is $value'})
  public userName!: string;

  @IsString({message: 'email is required'})
  @MaxLength(256, {message: 'Too long for field email'})
  @Matches( '[a-z0-9]+@[a-z]+.[a-z]{2,3}')
  public email!: string;

  @IsOptional()
  @MaxLength(256, {message: 'Too long for field avatarLink'})
  @Matches( '.*.(jpg|png)$')
  public avatarLink?: string;

  @IsString({message: 'Password is required'})
  @MinLength(6, {message: 'Password is too short. Minimal length is $constraint1 characters, but actual is $value'})
  @MaxLength(12, {message: 'Password is too long. Minimal length is $constraint1 characters, but actual is $value'})
  public password!: string;
}
