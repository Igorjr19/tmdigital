import { join } from 'path';
import { loadEnvFile } from 'process';
import { DataSource, DataSourceOptions } from 'typeorm';

import { existsSync } from 'fs';

const envPath = join(__dirname, '..', '..', '..', '..', '..', '..', '.env');
if (existsSync(envPath)) {
  loadEnvFile(envPath);
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.POSTGRES_PORT ?? '5432'),
  username: process.env.POSTGRES_USER ?? 'postgres',
  password: process.env.POSTGRES_PASSWORD ?? 'postgres',
  database: process.env.POSTGRES_DB ?? 'postgres',
  entities: [join(__dirname, '..', '..', '..', '**', '*.schema.{js,ts}')],
  migrations: [join(__dirname, 'migrations', '*.{js,ts}')],
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
};

const datasource = new DataSource(dataSourceOptions);

export default datasource;
