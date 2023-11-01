import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Product, TProduct, TProductResponse } from 'src/submodules/models/ProductModel/Product';
import { ProductQueryDto } from './dto/query-product';
import { ProductService } from './product.service';
import { JwtAuthGuard, Public } from 'src/guard/jwtGuard';

@ApiTags('products')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Public()
    @Get('')
    async findAll(@Query() query: ProductQueryDto): Promise<TProductResponse> {
        return this.productService.findAll(query);
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id') slug: string): Promise<Product> {
        return this.productService.findOneWithRelatedProducts(slug);
    }

    @Public()
    @Get('currentUpdate/:id')
    async findUpdate(@Param('id') id: number): Promise<Product> {
        return this.productService.findOneUpdate(Number(id));
    }

    @Post('store')
    async createProduct(@Body() product: Partial<TProduct>) {
        return this.productService.createProduct(product);
    }

    @Put('update/:id')
    async updateProduct(@Param('id') id: number, @Body() product: TProduct) {
        return this.productService.updateProduct(Number(id), product);
    }

    @Delete(':id')
    async removeProduct(@Param('id') id: number) {
        return this.productService.removeProductTrashed(Number(id));
    }
}
