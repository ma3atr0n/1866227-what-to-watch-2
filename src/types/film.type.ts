import { Genre } from './genre.enum.js';
import { User } from './user.type.js';

export type Film = {
  name: string,
  description: string,
  releaseDate: string,
  genre: keyof typeof Genre,
  year: number,
  rate: number,
  previewVideoLink: string,
  videoLink: string,
  starring: string[],
  director: string,
  runTime: number,
  commentsCount: number,
  posterLink: string,
  bgLink: string,
  bgColor: string,
  user: User,
}
