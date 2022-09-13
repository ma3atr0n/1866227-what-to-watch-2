import { Film } from '../types/film.type.js';
import { Genre } from '../types/genre.enum.js';

export const createFilms = (row: string):Film => {
  const elements = row.replace('\n', '').split('\t');
  const [name, description, releaseDate, genre, year, rate, previewVideoLink, videoLink, starring, director, runTime, commentsCount, posterLink, bgLink, bgColor, userName, email, avatarLink, password] = elements;

  return {
    name,
    description,
    releaseDate: releaseDate,
    genre: genre as Genre,
    year: Number.parseInt(year, 10),
    rate: Number.parseFloat(rate),
    previewVideoLink,
    videoLink,
    starring: starring ? starring.split(';') : [],
    director,
    runTime: Number.parseInt(runTime, 10),
    commentsCount: Number.parseInt(commentsCount, 10),
    posterLink,
    bgLink,
    bgColor,
    user: {userName, email, avatarLink, password},
  };
};
