import { DataTypes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { User } from 'src/submodules/models/UserModel/User';

import { baseAttributes } from 'src/helpers/defineModelFactory';
export interface Models extends User, Model {}
export const UserModel = SequelizeBase.define<Models>(
  'db_users',
  {
    ...baseAttributes,
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
    userGroup: {
      type: DataTypes.NUMBER,
      defaultValue: 1,
      references: {
        model: 'db_userGroup',
      },
    },
    status: {
      type: DataTypes.NUMBER,
      defaultValue: 1,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  },
);
