import { Category } from "src/submodules/models/ProductModel/Category";
import { CategoryModel } from "./category.schema";
import slugify from "slugify";

CategoryModel.beforeCreate((category: Category) => {
  category.slug = slugify(category.name, { lower: true });
});
CategoryModel.beforeUpdate((category: Category) => {
  category.slug = slugify(category.name, { lower: true });
});

export { CategoryModel };
