import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';

dotenv.config();

/**
 * This is the configuration for the TypeORM database connection.
 * It is used by the TypeORMModule in the AppModule.
 */
export const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'memowords',
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
};

/**
 * This is the TypeORM DataSource instance.
 * It is used by the typeorm CLI to synchronize the database and run migrations.
 */
const dataSource = new DataSource(ormConfig);

export default dataSource;
