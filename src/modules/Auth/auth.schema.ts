import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { Customer } from 'src/submodules/models/CustomerModel/Customer';
export interface Models extends Customer, Model {}
export const CustomerModel = SequelizeBase.define<Models>(
  'db_customers',
  {
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.NUMBER,
    },
    trash: {
      type: DataTypes.NUMBER,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.NUMBER,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
  },
);
