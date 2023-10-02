import { ConnectionOptions, DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + './**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: true,
};

const dataSource = new DataSource(ormConfig);

export default dataSource;
