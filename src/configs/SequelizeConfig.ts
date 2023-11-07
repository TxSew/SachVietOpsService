import { Sequelize } from 'sequelize';
dotenv.config();

const {DB_USERNAME, DB_PASSWORD, DB_NAME} = process.env
export const SequelizeBase = new Sequelize('db_books', process.env.DB_USERNAME, '', {
  host: 'localhost',
  dialect: 'mysql',
});
