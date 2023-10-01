import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/contanst';

export interface Product extends BaseModel, Modified {
  title?: string;
  desc?: string;
  producerID?: number;
  categoryId?: number;
  slug?: string;
  price?: number;
  image?: string;
  price_sale?: number;
  listImage?: string;
  quantity?: number;
  productId?: number;
}
export interface TProduct {
  product?: Product;
  productImages?: ProductImages[];
}
interface ProductImages extends Modified {
  productId?: number;
  image?: string;
}
export interface TProductResponse {
  page?: number;
  limit?: number;
  total?: number;
  products?: Product[];
}
