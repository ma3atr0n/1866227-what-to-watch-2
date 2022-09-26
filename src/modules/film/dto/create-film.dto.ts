import { Genre } from '../../../types/genre.enum.js';
import { User } from '../../../types/user.type.js';

export default class CreateFilmDTO {
  name!: string;
  description!: string;
  releaseDate!: string;
  genre!: keyof typeof Genre;
  year!: number;
  previewVideoLink!: string;
  videoLink!: string;
  starring!: string[];
  director!: string;
  runTime!: number;
  posterLink!: string;
  bgLink!: string;
  bgColor!: string;
  user!: User;
}
