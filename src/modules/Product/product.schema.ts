import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import slugify from "slugify";
import { SequelizeBase } from "src/configs/SequelizeConfig";
import { baseAttributes } from "src/helpers/defineModelFactory";
import { Product } from "src/submodules/models/ProductModel/Product";
import { ProducerModel } from "../Producer/producer.schema";
import { ImagesProductModel } from "./dto/listImage.schema";
import { CategoryModel } from "../Category/category.schema";
// export interface Models extends Product, Model {}

export class productModel extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {}

export const ProductModel = SequelizeBase.define<productModel>(
  "db_products",
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

ProductModel.hasMany(ImagesProductModel, {
  foreignKey: "productId",
  as: "productImages",
});
ProductModel.belongsTo(CategoryModel, {
  foreignKey: "categoryId",
  as: "category",
});
ProductModel.belongsTo(ProducerModel, {
  foreignKey: "producerID",
  as: "producer",
});
