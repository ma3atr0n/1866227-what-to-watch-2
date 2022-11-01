import { Genre } from '../../../types/genre.enum.js';
import {MaxLength, MinLength, IsDateString, IsInt, IsEnum, IsString, IsArray} from 'class-validator';

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

  public previewVideoLink!: string;

  public videoLink!: string;

  @IsArray({message: 'Field starrings must be an array'})
  @IsString({each: true, message: 'Starring must be string!'})
  public starrings!: string[];

  @MinLength(2, {message: 'Director is too short. Minimal length is $constraint1 characters, but actual is $value'})
  @MaxLength(20, {message: 'Director is too long. Minimal length is $constraint1 characters, but actual is $value'})
  public director!: string;

  @IsInt({message: 'runTime must be an integer'})
  public runTime!: number;

  public posterLink!: string;

  public bgLink!: string;

  @IsString({message: 'Background colot is required'})
  @MaxLength(256, {message: 'Too long for field bgColor'})
  public bgColor!: string;

  public userId!: string;
}
