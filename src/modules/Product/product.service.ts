import { Injectable, Param } from '@nestjs/common';
import { Models, ProductModel } from './product.schema';
import { Sequelize } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { ProductQueryDto } from './dto/query-product';

import {
  Product,
  TProductResponse,
} from 'src/submodules/models/ProductModel/Product';

@Injectable()
export class ProductService {
  async findAll(query: ProductQueryDto): Promise<TProductResponse> {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const offset = (page - 1) * limit;
    const findOptions: any = {
      limit,
      offset,
      order: [['createdAt', 'DESC']], // Sorting by purchasedDate in descending order
    };
    const data = await ProductModel.findAndCountAll(findOptions);
    const { rows: db_products, count: total } = data;
    return { total, limit, page, products: db_products };
  }
  async createProduct(data: Partial<Product>) {
    console.log(data);

    const productData = await ProductModel.create(data);
    return productData;
  }
}
