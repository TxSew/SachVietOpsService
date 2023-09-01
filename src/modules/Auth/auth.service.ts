import { Injectable, Param } from '@nestjs/common';
import { Product } from 'src/models/ProductModel/Product';
import { CustomerModel } from './auth.schema';
import * as bcrypt from 'bcrypt';
import { Customer } from 'src/models/CustomerModel/Customer';

@Injectable()
export class CustomerService {
  async getAll(): Promise<Customer[]> {
    const data = await CustomerModel.findAll({});
    return data;
  }
}
