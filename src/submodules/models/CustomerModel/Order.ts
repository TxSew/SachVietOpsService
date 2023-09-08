import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/contanst';

export interface Order extends BaseModel, Modified {
  orderCode: string | number;
  customerId?: number;
  orderDate?: Date;
  fullName?: string;
  phone?: number;
  province?: string;
  district?: string;
  address?: string;
}
