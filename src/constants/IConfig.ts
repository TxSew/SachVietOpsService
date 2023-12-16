import * as dotenv from 'dotenv';
import { Options } from 'sequelize';
dotenv.config();

export const getEnv = (key: string) => process.env[key];

export interface IConfig {
    ConnectDB: {
        development: Options;
    };
    stripe: {
        STRIPE_SECRET_KEY: string;
        STRIPE_SUCCESS_URL: string;
        STRIPE_CANCEL_URL: string;
    };
    cod: {
        COD_SUCCESS: string;
    };
    email: {
        EMAIL_NAME: string;
        EMAIL_PASS: string;
        EMAIL_HOST: string;
    };
    jwt: {
        secret: string;
    };
}

export const appConfig: IConfig = {
    ConnectDB: {
        development: {
            username: 'root',
            password: '',
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            port: +process.env.PORT,
            dialect: 'mysql',
            dialectOptions: {
                bigNumberStrings: true,
            },
        },
    },
    stripe: {
        STRIPE_SECRET_KEY: getEnv('STRIPE_SECRET_KEY'),
        STRIPE_SUCCESS_URL: getEnv('STRIPE_SUCCESS_URL'),
        STRIPE_CANCEL_URL: getEnv('STRIPE_CANCEL_URL'),
    },
    email: {
        EMAIL_NAME: getEnv('EMAIL_NAME'),
        EMAIL_PASS: getEnv('EMAIL_PASS'),
        EMAIL_HOST: getEnv('EMAIL_HOST'),
    },
    cod: {
        COD_SUCCESS: getEnv('COD_SUCCESS_URL'),
    },
    jwt: {
        secret: getEnv('JWT_SECRET_KEY') || 'book@123',
    },
};
