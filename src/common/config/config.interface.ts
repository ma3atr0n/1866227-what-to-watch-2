import { ConfigSchema } from './config.schema.js';

export interface IConfig {
  get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T];
}
