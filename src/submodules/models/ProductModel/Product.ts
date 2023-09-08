import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/contanst';

export interface Product extends BaseModel, Modified {
  title?: string;
  desc?: string;
  producerID?: number;
  categoryId?: number;
  price?: number;
  price_sale?: number;
  image?: string;
  listImage?: string;
  trash?: number;
}

export interface TProductResponse {
  products?: Product[];
  page?: number;
  limit?: number;
  total?: number;
}