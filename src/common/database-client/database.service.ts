import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { Component } from '../../types/component.types.js';
import { ILogger } from '../logger/logger.interface.js';
import { IDBClient } from './database.interface.js';

@injectable()
export class DBClient implements IDBClient {

  constructor(
    @inject(Component.ILogger) private logger: ILogger
  ) {}

  async connect(uri: string): Promise<void> {
    this.logger.info('Connection to DB...');
    console.log(uri);
    await mongoose.connect(uri);
    this.logger.info('A connection to DB was successfully!');
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Database connection closed.');
  }
}
