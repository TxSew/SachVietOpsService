import { DataTypes, Model } from 'sequelize';
import slugify from 'slugify';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Product } from 'src/submodules/models/ProductModel/Product';
import CategoryModel from '../Category/category.schema';
import { ProducerModel } from '../Producer/producer.schema';
import { ImagesProductModel } from './dto/listImage.schema';
export interface Models extends Product, Model {}
export const ProductModel = SequelizeBase.define<Models>(
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
    sale: {
      type: DataTypes.INTEGER,
    },
    price_sale: {
      type: DataTypes.INTEGER,
    },
    desc: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    freezeTableName: true,
  },
);

ProductModel.beforeCreate((category) => {
  category.slug = slugify(category.title, { lower: true, strict: true });
});
ProductModel.beforeUpdate((category) => {
  category.slug = slugify(category.title, { lower: true, strict: true });
});

ProductModel.hasMany(ImagesProductModel, {
  foreignKey: 'productId',
  as: 'productImages',
});
ProductModel.belongsTo(CategoryModel, {
  foreignKey: 'categoryId',
  as: 'category',
});
ProductModel.belongsTo(ProducerModel, {
  foreignKey: 'producerID',
  as: 'producer',
});
