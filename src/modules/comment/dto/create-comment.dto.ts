import {Min, Max, MaxLength, MinLength, IsDateString, IsMongoId, IsInt} from 'class-validator';

export class CreateCommentDTO {
  @MinLength(5, {message: 'Comment is too short. Minimal length is $constraint1 characters, but actual is $value'})
  @MaxLength(1024, {message: 'Comment is too long. Minimal length is $constraint1 characters, but actual is $value'})
  public comment!: string;

  @IsInt({message: 'Rating must be an integer'})
  @Min(1, {message: 'Comment rate must be greate or equal then $constraint1'})
  @Max(10, {message: 'Comment rate must be less or equal then $constraint1'})
  public rating!: number;

  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public date!: string;

  @IsMongoId({message: 'userId field must be valid ObjectID'})
  public userId!: string;
}
