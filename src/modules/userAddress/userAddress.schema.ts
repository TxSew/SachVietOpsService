import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { UserAddress } from 'src/submodules/models/UserModel/User';
class userAddress extends Model<InferAttributes<UserAddress>, InferCreationAttributes<UserAddress>> {}
export const UserAddressModel = SequelizeBase.define<userAddress>(
    'db_useraddress',
    {
        ...baseAttributes,
        userId: {
            type: DataTypes.INTEGER,
        },
        fullName: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
            unique: true,
        },
        province: {
            type: DataTypes.INTEGER,
        },
        district: {
            type: DataTypes.INTEGER,
        },
        address: {
            type: DataTypes.STRING,
        },
    },
    {
        freezeTableName: true,
    }
);
