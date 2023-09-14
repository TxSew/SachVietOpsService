import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
    const limit:number = query.limit || 2;
    const page = query.page || 2;
    const offset = (Number(page) - 1) * limit;
    const lm = Number(limit) 
    const findOptions: any = {
      lm,
      offset,
       order: [['createdAt', 'DESC']], // Sorting by purchasedDate in descending order
    };
    try {
      const Product = await ProductModel.findAndCountAll(findOptions);
      const { rows: db_products, count: total } = Product;
      return { total, limit, page, products: db_products };
    } catch (err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN);
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
  async createProduct(Product: Partial<Product>): Promise<Product> {
    try {
      if (!Product) {
        throw 'product creating not value';
      }
      const productData = await ProductModel.create(Product);
      return productData;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.ACCEPTED);
    }
  }
  // update a Product
  async updateProduct(id: number, product: Partial<Product>) {
    try {
      const updated = await ProductModel.update(product, {
        where: { id: id },
      });
      return updated;
    } catch (errors) {
      throw new BadRequestException(errors.message);
    }
  }
  //  search a Product
  async searchProduct() {
    return;
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
