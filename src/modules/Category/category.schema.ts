import { DataTypes, Model } from 'sequelize';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import slugify from 'slugify';

class CategoryModel extends Model {
  slug: string;
  name: string;
}
CategoryModel.init(
  {
    ...baseAttributes,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    level: {
      type: DataTypes.STRING,
      defaultValue: '1', // Provide a default value here
    },
    parentID: {
      type: DataTypes.NUMBER,
      defaultValue: 0, // Provide a default value here
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // Provide a default value here
    },
  },
  {
    freezeTableName: true,
    sequelize: SequelizeBase,
    modelName: 'db_category',
  },
);
CategoryModel.beforeCreate((category, opition) => {
  category.slug = slugify(category.name, { lower: true });
});
CategoryModel.beforeUpdate((category) => {
  category.slug = slugify(category.name, { lower: true });
});

export default CategoryModel;
