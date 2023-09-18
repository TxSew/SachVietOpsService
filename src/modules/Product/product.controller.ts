import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import {
  Product,
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
  @Get('inventory/sort')
   async Inventory ( @Query() query: ProductQueryDto):Promise<TProductResponse> {
      return this.productService.getInventory(query);
   } 
  @Get(':id')
  async findOne(@Param('id') slug: string): Promise<Product> {
    return this.productService.findOne(slug);
  }
  // @UseGuards(JwtMiddleware)
  // @UseGuards(JwtAuthGuard)
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
 
     
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeProduct<T>(@Param('id') id: T) {
    return this.productService.removeProduct(Number(id));
  }
}
