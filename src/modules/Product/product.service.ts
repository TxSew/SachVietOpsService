import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseError } from 'src/helpers/ResponseError';
import {
  Product,
  TProduct,
  TProductResponse,
} from 'src/submodules/models/ProductModel/Product';
import { ProducerModel } from '../Producer/producer.schema';
import { ImagesProductModel } from './dto/listImage.schema';
import { ProductQueryDto } from './dto/query-product';
import { ProductModel } from './product.schema';
import { CategoryModel } from '../Category/category.schema';
import { Op } from 'sequelize';

@Injectable()
export class ProductService {
  //find all products
  async findAll(query: ProductQueryDto): Promise<TProductResponse> {
    const limit = query.limit || 3;
    const page = query.page || 1;
    const limited = Number(limit);
    const offset = (Number(page) - 1) * limited;
    const products = await ProductModel.findAll({});
    try {
      const Product = await ProductModel.findAll({
        limit: limited,
        offset,
        order: [['createdAt', 'DESC']], // Sorting by purchasedDate in descending order
        include: [
          {
            model: ImagesProductModel,
            attributes: ['image', 'id'],
            as: 'productImages',
          },
          {
            model: CategoryModel,
            attributes: ['name', 'parentId', 'id'],
            as: 'category',
          },
          {
            model: ProducerModel,
            attributes: ['name', 'id', 'code'],
            as: 'producer',
          },
        ],
      })
        .then(async (res) => {
          return JSON.parse(JSON.stringify(res));
        })
        .catch((err) => {
          throw ResponseError.badInput(`Unable to parse ${err.message}`);
        });
      const totalPage = Math.round(products.length / limited);
      return { totalPage, limit: limited, page, products: Product };
    } catch (err) {
      throw ResponseError.unexpected(err);
    }
  }
  // find One or more products
  async findOneWithRelatedProducts(slug: string): Promise<any> {
    try {
      // Find the product with the provided slug
      const product = await ProductModel.findOne({
        include: [
          {
            model: ImagesProductModel,
            attributes: ['image', 'id'],
            as: 'productImages',
          },
          {
            model: CategoryModel,
            as: 'category',
          },
          {
            model: ProducerModel,
            as: 'producer',
          },
        ],
        where: { slug: slug },
      });

      if (!product) {
        throw ResponseError.notFound('Product not found');
      }
      // Find related products based on the same category
      const relatedProducts = await ProductModel.findAll({
        include: [
          {
            model: ImagesProductModel,
            attributes: ['image', 'id'],
            as: 'productImages',
          },
          {
            model: CategoryModel,
            as: 'category',
          },
          {
            model: ProducerModel,
            as: 'producer',
          },
        ],
        where: { categoryId: product.categoryId, id: { [Op.not]: product.id } }, // Exclude the current product
        limit: 5, // You can adjust the limit as needed
      });

      return { product, relatedProducts };
    } catch (err) {
      return err;
    }
  }

  // find One or more products
  async findOneUpdate(id: string): Promise<Product> {
    try {
      const findOne = await ProductModel.findOne({
        include: [
          {
            model: ImagesProductModel,
            as: 'productImage',
          },
        ],
        where: { id: id },
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
  async createProduct(TProduct: TProduct) {
    try {
      const Products: any = TProduct.product;
      console.log(Products);
      const ProductImages: any[] = TProduct.productImages;
      if (!Products) {
        throw 'product creating not value';
      }
      const ProductData = await ProductModel.create(Products);

      let Id = await ProductData.get().id;
      for (var i = 0; i < ProductImages.length; i++) {
        ProductImages[i].productId = Id;
      }
      const data = await ImagesProductModel.bulkCreate(ProductImages);
      return {
        ProductImages: data,
        Product: ProductData,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.ACCEPTED);
    }
  }
  // update a Product
  async updateProduct(id: number, TProduct: TProduct) {
    const parInt = id;
    console.log(TProduct);
    const Products: any = TProduct.product;
    const ProductImages: any[] = TProduct.productImages;
    if (ProductImages.length > 0) {
      const destroy = await ImagesProductModel.destroy({
        where: { productId: parInt },
      });
      console.log(destroy);
    }

    try {
      const updated = await ProductModel.update(Products, {
        where: { id: parInt },
      });

      for (var i = 0; i < ProductImages.length; i++) {
        ProductImages[i].productId = parInt;
        const data = await ImagesProductModel.bulkCreate(ProductImages);
        return updated;
      }
    } catch (errors) {
      throw ResponseError.badInput('Product update failed');
    }
  }
  //  search a Product
  async removeProductTrashed(id: number) {
    const trashed = await ProductModel.destroy({
      where: { id: id },
    });
    return trashed;
  }
  async restoreProductTrashed(id: number) {
    const trashed = await ProductModel.restore({
      where: { id: id },
    });
    return trashed;
  }
}
