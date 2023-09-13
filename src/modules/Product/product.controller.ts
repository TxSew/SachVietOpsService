import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import {
  Product,
  TProductResponse,
} from 'src/submodules/models/ProductModel/Product';
import { ProductQueryDto } from './dto/query-product';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { JwtMiddleware } from 'src/guard/jwt.middleware';

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
  // @UseGuards(JwtMiddleware)
  @UseGuards(JwtAuthGuard)
  @Post('store')
  async createProduct(@Body() product :Partial<Product>): Promise<Product> {
    console.log(product);
    return this.productService.createProduct(product);
  }
  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateProduct(@Param('id') id: number, @Body() product: Product) {
    return this.productService.updateProduct(id, product);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeProduct(@Param('id') id: string) {
    return this.productService.trashRemoveProduct(Number(id));
  }
}
