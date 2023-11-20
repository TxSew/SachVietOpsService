import { DataTypes } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { ProductModel } from '../product';

export const CartModel = SequelizeBase.define<any>(
    'db_cart',
    {
        ...baseAttributes,
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
        },
    },
    {
        freezeTableName: true,
    }
);
CartModel.belongsTo(ProductModel, {
    foreignKey: 'productId',
    as: 'productCart',
});
