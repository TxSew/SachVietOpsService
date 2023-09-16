import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/contanst';

export interface Product extends BaseModel, Modified {
  title?: string;
  desc?: string;
  producerID?: number;
  categoryId?: number;
  slug?: string;
  price?: number;
  price_sale?: number;
  image?: string;
  listImage?: string;
   productId?:number
}

export interface TProductResponse {
  page?: number;
  limit?: number;
  total?: number;
  products?: Product[];
}
