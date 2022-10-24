import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchema = {
  NODE_ENV: string,
  SALT: string
  APP_PORT: number,
  DB_HOST: string,
  DB_PORT: number,
  DB_NAME: string,
  DB_USER: string,
  DB_PASSWORD: string,
  UPLOAD_DIRECTORY: string,
  JWT_SECRET: string,
}


export const configSchema = convict<ConfigSchema>({
  NODE_ENV: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  SALT: {
    doc: 'SALT environment',
    format: String,
    default: '',
    env: 'SALT'
  },
  APP_PORT: {
    doc: 'Application PORT',
    default: 4000,
  },
  DB_HOST: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'DB_HOST',
  },
  DB_PORT: {
    doc: 'The port to bind.',
    format: 'port',
    default: 27017,
    env: 'DB_PORT',
    arg: 'port'
  },
  DB_NAME: {
    doc: 'The Data Base name to bind.',
    format: String,
    default: 'films',
    env: 'DB_NAME',
  },
  DB_USER: {
    doc: 'The Data Base user to bind.',
    format: String,
    default: null,
    env: 'DB_USER',
  },
  DB_PASSWORD: {
    doc: 'The Data Base password to bind.',
    format: String,
    default: null,
    env: 'DB_PASSWORD',
  },
  UPLOAD_DIRECTORY: {
    doc: 'Upload directory for files to bind.',
    format: String,
    default: null,
    env: 'UPLOAD_DIRECTORY',
  },
  JWT_SECRET: {
    doc: 'JWT Secret to bind.',
    format: String,
    default: null,
    env: 'JWT_SECRET',
  }
});
