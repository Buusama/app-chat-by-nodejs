import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { connectionOptions } from './database.config';

export interface IConfig {
  env: string;
  database: DataSourceOptions;
}

export default (): Partial<IConfig> => ({
  env: process.env.NODE_ENV || 'development',
  database: connectionOptions,
});
