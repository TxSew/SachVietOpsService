import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Otp } from 'src/submodules/models/OptModel/Opt';

interface TOpt extends Model<InferAttributes<Otp>, InferCreationAttributes<Otp>> {}
export const OptModel = SequelizeBase.define<TOpt>(
    'db_otpToken',
    {
        ...baseAttributes,
        email: {
            type: DataTypes.STRING,
        },
        code: {
            type: DataTypes.STRING,
        },
    },
    {
        freezeTableName: true,
    }
);
