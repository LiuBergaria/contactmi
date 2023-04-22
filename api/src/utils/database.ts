import { Pool } from 'pg';
import config from '../config';

const database = new Pool({
  host: config.database.HOST,
  port: config.database.PORT,
  user: config.database.USER,
  password: config.database.PASSWORD,
  database: config.database.NAME,
  max: config.database.MAX,
});

export default database;
