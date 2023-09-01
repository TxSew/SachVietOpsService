// src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  async create(product: Product): Promise<Product> {
    return this.productModel.create(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  async findOne(id: number): Promise<Product> {
    return this.productModel.findByPk(id);
  }

  async update(id: number, product: Product): Promise<[number, Product[]]> {
    return;
  }

  async remove(id: number): Promise<number> {
    const result = await this.productModel.destroy({
      where: { id },
    });
    return result;
  }
}
