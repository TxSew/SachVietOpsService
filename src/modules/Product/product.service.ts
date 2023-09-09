import { Injectable, NotFoundException, Param } from '@nestjs/common';
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
  //find all products
  async findAll(query: ProductQueryDto): Promise<TProductResponse> {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const offset = (page - 1) * limit;
    const findOptions: any = {
      where: {
        deleteAt: 1,
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']], // Sorting by purchasedDate in descending order
    };
    const data = await ProductModel.findAndCountAll(findOptions);
    const { rows: db_products, count: total } = data;
    return { total, limit, page, products: db_products };
  }
  // find One or more products
  async findOne(slug: string): Promise<Product> {
    try {
      const findOne = await ProductModel.findOne({
        where: { slug: slug, deleteAt: 1 },
      });
      if (!findOne) {
        throw 'Product not found';
      }
      return findOne;
    } catch (err) {
      return err;
    }
  }
  // create a new Product
  async createProduct(data: Partial<Product>) {
    const productData = await ProductModel.create(data);
    return productData;
  }
  // update a Product
  async updateProduct(id: number, data: Partial<Product>) {
    const updated = await ProductModel.update(data, {
      where: { id: id },
    });
    return updated;
  }
  //delete a Product
  async trashRemoveProduct(id: number) {
    const trashed = await ProductModel.update(
      {
        deleteAt: 0,
      },
      {
        where: { id: id },
      },
    );
    console.log(trashed);
    if (trashed) {
      return { message: 'Item moved to trash' };
    }
    {
      return ' product not found';
    }
    // Set the 'deletedAt' timestamp to mark the item as deleted

    // Save the item with the 'deletedAt' timestamp
  }
  async removed() {}
}
