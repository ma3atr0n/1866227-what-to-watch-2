import dayjs from 'dayjs';
import { MockData } from '../../types/mock.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/renadom.js';
import { IGenerator } from './film-generator.interface.js';

const YEAR_MIN = 2015;
const YEAR_MAX= 2022;
const RATE_MIN = 3;
const RATE_MAX = 10;
const RATE_SIZE = 1;
const RUN_TIME_MIN = 150;
const RUN_TIME_MAX = 200;
const COMMENTS_MIN = 0;
const COMMENTS_MAX = 25;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class FilmGenerator implements IGenerator {
  constructor(private readonly mockData: MockData) {}

  generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const releaseDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const genre = getRandomItem<string>(this.mockData.genres);
    const year = generateRandomValue(YEAR_MIN, YEAR_MAX);
    const rate = generateRandomValue(RATE_MIN, RATE_MAX, RATE_SIZE);
    const previewVideoLink = getRandomItem<string>(this.mockData.videoLinks);
    const videoLink = previewVideoLink;
    const starring = getRandomItems<string>(this.mockData.humanNames).join(';');
    const director = getRandomItem<string>(this.mockData.humanNames);
    const runTime = generateRandomValue(RUN_TIME_MIN, RUN_TIME_MAX);
    const commentsCount = generateRandomValue(COMMENTS_MIN, COMMENTS_MAX);
    const posterLink = getRandomItem<string>(this.mockData.pictureLinks);
    const bgLink = getRandomItem<string>(this.mockData.pictureLinks);
    const bgColor = getRandomItem<string>(this.mockData.colors);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatarLink = getRandomItem<string>(this.mockData.pictureLinks);
    const password = getRandomItem<string>(this.mockData.passwords);

    const [userName, ] = getRandomItem<string>(this.mockData.humanNames).split(' ');

    return [
      name, description, releaseDate, genre, year, rate, previewVideoLink, videoLink,
      starring, director, runTime, commentsCount, posterLink, bgLink, bgColor,
      userName, email, avatarLink, password,
    ].join('\t');
  }
}

