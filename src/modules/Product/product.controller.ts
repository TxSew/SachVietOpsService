import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Models } from './product.schema';
import { ApiTags } from '@nestjs/swagger';
import {
  Product,
  TProductResponse,
} from 'src/submodules/models/ProductModel/Product';
import { ProductQueryDto } from './dto/query-product';
import { query } from 'express';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  async findAll(@Query() query: ProductQueryDto): Promise<TProductResponse> {
    return this.productService.findAll(query);
  }
  @Get(':id')
  async findOne(@Param('id') slug: string): Promise<Product> {
    return this.productService.findOne(slug);
  }
  @Post('store')
  async createProduct(@Body() product) {
    console.log(product);
    return this.productService.createProduct(product);
  }
  @Put('update/:id')
  async updateProduct(@Param('id') id: number, @Body() product: Product) {
    return this.productService.updateProduct(id, product);
  }
  @Delete(':id')
  async removeProduct(@Param('id') id: string) {
    return this.productService.trashRemoveProduct(Number(id));
  }
}
