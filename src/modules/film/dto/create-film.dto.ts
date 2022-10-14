import { Genre } from '../../../types/genre.enum.js';
import {MaxLength, MinLength, IsDateString, IsMongoId, IsInt, IsEnum, IsString, IsArray, Matches} from 'class-validator';

export default class CreateFilmDTO {
  @MinLength(5, {message: 'Film name is too short. Minimal length is $constraint1 characters, but actual is $value'})
  @MaxLength(100, {message: 'Film name is too long. Minimal length is $constraint1 characters, but actual is $value'})
  public name!: string;

  @MinLength(20, {message: 'Film description is too short. Minimal length is $constraint1 characters, but actual is $value'})
  @MaxLength(1024, {message: 'Film description is too long. Minimal length is $constraint1 characters, but actual is $value'})
  public description!: string;

  @IsDateString({}, {message: 'releaseDate must be valid ISO date'})
  public releaseDate!: string;

  @IsEnum(Genre, {message: 'type must be Genre enum'})
  public genre!: keyof typeof Genre;

  @IsInt({message: 'year must be an integer'})
  public year!: number;

  @IsString({message: 'Preview video link is required'})
  @MaxLength(256, {message: 'Too long for field «previewVideoLink»'})
  public previewVideoLink!: string;

  @IsString({message: 'Video link is required'})
  @MaxLength(256, {message: 'Too long for field «videoLink»'})
  public videoLink!: string;

  @IsArray({message: 'Field starrings must be an array'})
  @IsString({each: true, message: 'Starring must be string!'})
  public starrings!: string[];

  @MinLength(2, {message: 'Director is too short. Minimal length is $constraint1 characters, but actual is $value'})
  @MaxLength(20, {message: 'Director is too long. Minimal length is $constraint1 characters, but actual is $value'})
  public director!: string;

  @IsInt({message: 'runTime must be an integer'})
  public runTime!: number;

  @IsString({message: 'Poster link is required'})
  @MaxLength(256, {message: 'Too long for field posterLink'})
  @Matches( '.*.jpg$')
  public posterLink!: string;

  @IsString({message: 'Poster link is required'})
  @MaxLength(256, {message: 'Too long for field bgLink'})
  @Matches( '.*.jpg$')
  public bgLink!: string;

  @IsString({message: 'Background colot is required'})
  @MaxLength(256, {message: 'Too long for field bgColor'})
  public bgColor!: string;

  @IsMongoId({message: 'UserID must be ObjectID type!'})
  public userId!: string;
}
