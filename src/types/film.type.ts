import { Genre } from './genre.enum.js';

export type User = {
  userName: string,
  email: string,
  avatarLink: string,
  password: string,
}

export type Film = {
  name: string,
  description: string,
  releaseDate: Date,
  genre: Genre,
  year: string,
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
