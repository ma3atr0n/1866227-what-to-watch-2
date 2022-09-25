import { Film } from '../types/film.type.js';
import { Genre } from '../types/genre.enum.js';
import crypto from 'crypto';

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

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};
