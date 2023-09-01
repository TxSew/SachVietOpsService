import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/contanst';

export interface Product extends BaseModel, Modified {
  name?: string;
  desc?: string;
  producer?: string;
  categoryID?: string;
  price?: number;
  priceSale?: number;
  image?: string;
  listImage?: string;
  trashed?: boolean;
}
