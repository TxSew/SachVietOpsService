import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Category } from 'src/submodules/models/ProductModel/Category';
import { CategoryService } from './category.service';
import { CategoryQueryDto } from './dto/Category.schema';
import { serviceName } from 'src/constants/IServiceName';
import { JwtAuthGuard, Public } from 'src/guard/jwtGuard';
@ApiTags(serviceName.category)
@UseGuards(JwtAuthGuard)
@Controller(serviceName.category)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Public()
    @Get('')
    getAll(@Query() query: CategoryQueryDto) {
        return this.categoryService.getAll(query);
    }

    @Public()
    @Get('getCategories')
    getCategories(@Query() query: CategoryQueryDto) {
        return this.categoryService.getCategories(query);
    }

    @Public()
    @Post('filter')
    getListCategory() {
        return this.categoryService.filter();
    }

    @Public()
    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.categoryService.getOne(id);
    }

    @Post('store')
    createCategory(@Body() category: Partial<Category>) {
        return this.categoryService.createCategory(category);
    }

    @Put('update/:id')
    updateCategory(@Param('id') id: number, @Body() category: Category) {
        return this.categoryService.updateCategory(Number(id), category);
    }

    @Delete(':id')
    removeCategory(@Param('id') id: number) {
        return this.categoryService.removeCategory(Number(id));
    }
}
