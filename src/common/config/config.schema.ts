import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchema = {
  PORT: number,
  NODE_ENV: string,
  HOST: string,
  SALT: string
}


export const configSchema = convict<ConfigSchema>({
  NODE_ENV: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  HOST: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'HOST',
  },
  PORT: {
    doc: 'The port to bind.',
    format: 'port',
    default: 1234,
    env: 'PORT',
    arg: 'port'
  },
  SALT: {
    doc: 'SALT environment',
    format: String,
    default: '',
    env: 'SALT'
  }
});
