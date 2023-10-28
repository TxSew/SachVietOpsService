import * as dotenv from "dotenv";
import { Options } from "sequelize";
dotenv.config();

export const getEnv = (key: string) => process.env[key];
export const IS_DEVELOPER_ENV = getEnv("NODE_ENV").toLowerCase() == "localhost";

export interface IConfig {
  ConnectDB: {
    development: Options;
  };
  stripe: {
    STRIPE_SECRET_KEY: string;
    STRIPE_SUCCESS_URL: string;
    STRIPE_CANCEL_URL: string;
  };
  email: {
    EMAIL_NAME: string;
    EMAIL_PASS: string;
    EMAIL_HOST: string;
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
  stripe: {
    STRIPE_SECRET_KEY: getEnv("STRIPE_SECRET_KEY"),
    STRIPE_SUCCESS_URL: getEnv("STRIPE_SUCCESS_URL"),
    STRIPE_CANCEL_URL: getEnv("STRIPE_CANCEL_URL"),
  },
  email: {
    EMAIL_NAME: getEnv("EMAIL_NAME"),
    EMAIL_PASS: getEnv("EMAIL_PASS"),
    EMAIL_HOST: getEnv("EMAIL_HOST"),
  },
};
