import { Film } from '../types/film.type.js';
import { Genre } from '../types/genre.enum.js';
import crypto from 'crypto';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { SignJWT } from 'jose';

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


export const fillResponse = <T, V>(ResponseObject: ClassConstructor<T>, baseObject: V) =>
  plainToInstance(ResponseObject, baseObject, {excludeExtraneousValues: true});

export const createErrorObject = (message: string) => ({
  error: message,
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
