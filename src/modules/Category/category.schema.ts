import { DataTypes, Model } from 'sequelize';
import slugify from 'slugify';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Category } from 'src/submodules/models/ProductModel/Category';

export interface ModelCategory extends Category, Model {}
export const CategoryModel = SequelizeBase.define<ModelCategory>(
  'db_category',
  {
    ...baseAttributes,
    name: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    level: {
      type: DataTypes.STRING,
      defaultValue: '1', // Provide a default value here
    },
    image: {
      type: DataTypes.STRING,
      unique: true,
    },
    parentId: {
      type: DataTypes.NUMBER,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Provide a default value here
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  },
);
CategoryModel.beforeCreate((category) => {
  category.slug = slugify(category.name, { lower: true });
});
CategoryModel.beforeUpdate((category) => {
  category.slug = slugify(category.name, { lower: true });
});
