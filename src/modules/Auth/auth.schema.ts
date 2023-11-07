import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { User } from 'src/submodules/models/UserModel/User';

import { baseAttributes } from 'src/helpers/defineModelFactory';

export class Users extends Model<InferAttributes<User>, InferCreationAttributes<User>> {}
export const UserModel = SequelizeBase.define<Users>(
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
        },
    },
    {
        paranoid: true,
        timestamps: true,
    }
);
