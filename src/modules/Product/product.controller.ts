import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Models } from './product.schema';
import { ApiTags } from '@nestjs/swagger';
import {
  Product,
  TProductResponse,
} from 'src/submodules/models/ProductModel/Product';
import { ProductQueryDto } from './dto/query-product';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  async findAll(@Query() query: ProductQueryDto): Promise<TProductResponse> {
    return this.productService.findAll(query);
  }
  @Post('store')
  async createProduct(@Body() product: Partial<Product>) {
    console.log(product);

    return this.productService.createProduct(product);
  }
}
