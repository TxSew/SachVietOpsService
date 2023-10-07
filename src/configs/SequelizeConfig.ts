import { Sequelize } from 'sequelize';

export const SequelizeBase = new Sequelize('db_books', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});
