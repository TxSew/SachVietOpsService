import { Sequelize } from 'sequelize';
dotenv.config();

const {DB_USERNAME, DB_PASSWORD, DB_NAME} = process.env
export const SequelizeBase = new Sequelize(DB_NAME || 'db_books', DB_USERNAME || 'root', DB_PASSWORD || '', {
  host: 'localhost',
  dialect: 'mysql',
});
