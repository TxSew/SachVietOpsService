import { DataTypes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Product } from 'src/submodules/models/ProductModel/Product';
export interface Models extends Product, Model {}
export const ProductModel = SequelizeBase.define<Models>('db_products', {
  ...baseAttributes,
  categoryId: {
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  listImage: {
    type: DataTypes.STRING,
  },
  sortDesc: {
    type: DataTypes.TEXT,
  },
  producerID: {
    type: DataTypes.INTEGER,
  },
  number: {
    type: DataTypes.INTEGER,
  },
  sale: {
    type: DataTypes.INTEGER,
  },
  price_sale: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});