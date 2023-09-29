import { DataTypes, Model } from 'sequelize';
import slugify from 'slugify';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { convertToSlug } from 'src/helpers/helpers';
import { Product } from 'src/submodules/models/ProductModel/Product';
import { ImagesProductModel } from './dto/listImage.schema';
import CategoryModel from '../Category/category.schema';
import { ProducerModel } from '../Producer/producer.schema';
export interface Models extends Product, Model {
  then(arg0: (data: any) => void): unknown;
}
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

ProductModel.beforeCreate((category, opition) => {
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
