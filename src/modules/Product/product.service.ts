import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Product,
  TProductResponse,
} from 'src/submodules/models/ProductModel/Product';
import { ProductQueryDto } from './dto/query-product';
import { ProductModel } from './product.schema';

@Injectable()
export class ProductService {
  //find all products
  async findAll(query: ProductQueryDto): Promise<TProductResponse> {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const offset = (page - 1) * limit;
const findOptions: any = {
      // where: {
      //   deleteAt: 1,
      // },
      limit,
      offset,
      order: [['createdAt', 'DESC']], // Sorting by purchasedDate in descending order
    };

     try {
       
       const data = await ProductModel.findAndCountAll(findOptions);
       const { rows: db_products, count: total } = data;
       return { total, limit, page, products: db_products };
     }
      catch(err){
         throw new Error(err);
      }
  }
  // find One or more products
  async findOne(slug: string): Promise<Product> {
    try {
      const findOne = await ProductModel.findOne({
        where: { slug: slug },
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
  async createProduct(data: Partial<Product>): Promise<Product> {
    try {
      if (!data) {
       throw "product creating not value"
      }
      const productData = await ProductModel.create(data);
      return productData;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.ACCEPTED);
    
    }
  }
  // update a Product
  async updateProduct(id: number, data: Partial<Product>) {
    try {
      const updated = await ProductModel.update(data, {
        where: { id: id },
      });
      return updated;
    } catch (errors) {
      throw new BadRequestException(errors.message); 
    }
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
