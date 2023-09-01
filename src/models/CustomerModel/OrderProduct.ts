import { BaseModel } from '../BaseModel';

export interface OrderProduct extends BaseModel {
  orderId?: number;
  productId?: number;
  count?: number;
  price?: number;
}
