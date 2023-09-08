import { Sequelize } from 'sequelize';

export const SequelizeBase = new Sequelize('db_shop', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});
