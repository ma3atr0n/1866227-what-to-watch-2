import { readFileSync } from 'fs';
import { Film } from '../../types/film.type.js';
import { Genre } from '../../types/genre.enum.js';
import { IFileReader } from './file-reader.interface.js';

export default class TSVFileReader implements IFileReader {
  private rawData = '';

  constructor(readonly fileName: string) {}

  public read(): void {
    this.rawData = readFileSync(this.fileName, {encoding: 'utf-8'});
  }

  public toArray():Film[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\r\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([name, description, releaseDate, genre, year, rate, previewVideoLink, videoLink, starring, director, runTime, commentsCount, posterLink, bgLink, bgColor, userName, email, avatarLink, password]) => ({
        name,
        description,
        releaseDate: new Date(releaseDate),
        genre: genre as Genre,
        year,
        rate: Number.parseFloat(rate),
        previewVideoLink,
        videoLink,
        starring: starring.split(';'),
        director,
        runTime: Number.parseInt(runTime, 10),
        commentsCount: Number.parseInt(commentsCount, 10),
        posterLink,
        bgLink,
        bgColor,
        user: {userName, email, avatarLink, password},
      }));
  }
}
