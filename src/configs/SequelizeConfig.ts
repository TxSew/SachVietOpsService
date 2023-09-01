import { Sequelize } from 'sequelize';

export const SequelizeConfig = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  password: '',
  database: process.env.DB_NAME,
  port: 3000,
  dialect: 'mysql',
  logging: console.log,
});
