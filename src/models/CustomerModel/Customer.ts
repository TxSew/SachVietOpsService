import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/contanst';

export interface Customer extends BaseModel {
  fullName?: string;
  username?: string;
  password?: string;
  phone?: string;
  address?: string;
  email?: string;
}
