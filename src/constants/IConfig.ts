import * as dotenv from "dotenv";
import { Options } from "sequelize";
dotenv.config();

export const getEnv = (key: string) => process.env[key];
export const IS_DEVELOPER_ENV = getEnv("NODE_ENV").toLowerCase() == "localhost";

export interface IConfig {
  ConnectDB: {
    development: Options;
  };
}

export const ConfigDatabase: IConfig = {
  ConnectDB: {
    development: {
      username: "root",
      password: "",
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: +process.env.PORT,
      dialect: "mysql",
      dialectOptions: {
        bigNumberStrings: true,
      },
    },
  },
};
