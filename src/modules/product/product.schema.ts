import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import slugify from 'slugify';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Product } from 'src/submodules/models/ProductModel/Product';

export class productModel extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {}

export const ProductModel = SequelizeBase.define<productModel>(
    'db_products',
    {
        ...baseAttributes,
        categoryId: {
            type: DataTypes.INTEGER,
        },
        title: {
            type: DataTypes.STRING,
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
        },
        producerID: {
            type: DataTypes.INTEGER,
        },
        quantity: {
            type: DataTypes.INTEGER,
        },
        image: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.INTEGER,
        },
        sale: {
            type: DataTypes.INTEGER,
        },
        price_sale: {
            type: DataTypes.INTEGER,
        },
        desc: {
            type: DataTypes.STRING,
        },
        soldQuantity: {
            type: DataTypes.INTEGER,
        },
        soldInventory: {
            type: DataTypes.INTEGER,
        },
        size: {
            type: DataTypes.STRING,
        },
        pageNumber: {
            type: DataTypes.INTEGER,
        },
        author: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.INTEGER,
        },
    },
    {
        freezeTableName: true,
        paranoid: true,
    }
);
ProductModel.beforeCreate((product: Product) => {
    product.slug = slugify(product.title, { lower: true, strict: true });
});
ProductModel.beforeUpdate((product: Product) => {
    product.slug = slugify(product.title, { lower: true, strict: true });
});
