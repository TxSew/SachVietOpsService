import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Product,
  TProduct,
  TProductResponse,
} from 'src/submodules/models/ProductModel/Product';
import { ProductQueryDto } from './dto/query-product';
import { ProductService } from './product.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('')
  async findAll(@Query() query: ProductQueryDto): Promise<TProductResponse> {
    return this.productService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') slug: string): Promise<Product> {
    return this.productService.findOneWithRelatedProducts(slug);
  }
  @Get('currentUpdate/:id')
  async findUpdate(@Param('id') slug: string): Promise<Product> {
    return this.productService.findOneUpdate(slug);
  }
  // @UseGuards(JwtMiddleware)
  // @UseGuards(JwtAuthGuard)
  @Post('store')
  async createProduct(@Body() product: Partial<TProduct>): Promise<any> {
    return this.productService.createProduct(product);
  }
  // @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updateProduct(@Param('id') id: number, @Body() product: TProduct) {
    return this.productService.updateProduct(Number(id), product);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeProduct(@Param('id') id: number) {
    return this.productService.removeProductTrashed(Number(id));
  }
}
