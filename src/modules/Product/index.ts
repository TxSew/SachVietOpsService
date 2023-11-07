import slugify from "slugify";
import { ProductModel } from "./product.schema";
import { ImagesProductModel } from "./dto/listImage.schema";
import { Product } from "src/submodules/models/ProductModel/Product";
import { CategoryModel } from "../Category";
import { ProducerModel } from "../Producer/producer.schema";
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
export { ProductModel, CategoryModel, ImagesProductModel, ProducerModel };
