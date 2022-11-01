import { Film } from '../types/film.type.js';
import { Genre } from '../types/genre.enum.js';
import crypto from 'crypto';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { SignJWT } from 'jose';
import { isObject, ValidationError } from 'class-validator';
import { ValidationErrorField } from '../types/validation-error-field.type.js';
import { ServiceError } from '../types/service-error.enum.js';
import { UnknownObject } from '../types/unknown-object.type.js';
import { DEFAULT_STATIC_IMAGES } from '../app/application.constant.js';

export const createFilms = (row: string):Film => {
  const elements = row.replace('\n', '').split('\t');
  const [name, description, releaseDate, genre, year, rate, previewVideoLink, videoLink, starrings, director, runTime, commentsCount, posterLink, bgLink, bgColor, userName, email, avatarLink, password] = elements;

  return {
    name,
    description,
    releaseDate: releaseDate,
    genre: genre as Genre,
    year: Number.parseInt(year, 10),
    rate: Number.parseFloat(rate),
    previewVideoLink,
    videoLink,
    starrings: starrings ? starrings.split(';') : [],
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

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message: message,
  details: details,
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[]  =>
  errors.map((error) => ({
    property: error.property,
    value: error.value,
    messages: error.constraints ? Object.values(error.constraints) : [],
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (target: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if(key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

export const transformObject = (propertys: string[], staticPath: string, uploadPath: string, data: UnknownObject): void => {
  propertys
    .forEach((property) => transformProperty(property, data, (target: UnknownObject): void => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    }));
};
