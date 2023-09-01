// src/product/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() product: Product): Promise<Product> {
    return this.productService.create(product);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() product: Product,
  ): Promise<[number, Product[]]> {
    return this.productService.update(+id, product);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<number> {
    return this.productService.remove(+id);
  }
}
