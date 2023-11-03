import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import slugify from 'slugify';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Category } from 'src/submodules/models/ProductModel/Category';
import { ProductModel } from '../Product/product.schema';

export interface ModelCategory extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {}
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
    }
);

CategoryModel.beforeCreate((category: Category) => {
    category.slug = slugify(category.name, { lower: true });
});
CategoryModel.beforeUpdate((category: Category) => {
    category.slug = slugify(category.name, { lower: true });
});
