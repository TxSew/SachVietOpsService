import { Model } from "sequelize";
import { BaseModel } from "../BaseModel";
import { Modified } from "../BaseModel/constanst";

export interface Category extends BaseModel, Modified , Model{
  name?: string;
  slug?: string;
  parentId?: string;
  level?: number;
  image?: string;
  orders?: number;
}
interface subcategories {
  id: number;
}
interface Subcategories extends Category {
  subcategories: subcategories[];
}
 export interface TOrderResponse {
  Category: Category;
  SubCategory: Subcategories[];
}


