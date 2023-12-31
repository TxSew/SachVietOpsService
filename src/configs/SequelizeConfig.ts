import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;
export const SequelizeBase = new Sequelize(DB_NAME || 'db_books', DB_USERNAME || 'root', DB_PASSWORD || '', {
    host: DB_HOST || 'localhost',
    dialect: 'mysql',
});
