import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { User } from 'src/submodules/models/UserModel/User';
export interface Models extends User, Model {}
export const UserModel = SequelizeBase.define<Models>(
  'db_users',
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
    // phone: {
    //   type: DataTypes.NUMBER,
    // },
     userGroup: {
      type: DataTypes.NUMBER,
       defaultValue:1,
        references: {
           model:"db_userGroup"
        }
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
