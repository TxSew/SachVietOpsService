import {
  Delete,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'src/submodules/models/ProductModel/Category';
import { BaseModel } from 'src/submodules/models/BaseModel';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAll() {
    return this.categoryService.getAll();
  }
  @Get(':id')
  getOne(@Param() id: number) {
    return this.categoryService.getOne(id);
  }
  @Post('store')
  createCategory(@Body() category) {
    console.log(category);

    return this.categoryService.createCategory(category);
  }
  @Put('update/:id')
  updateCategory(@Param('id') id: number, @Body() category: Category) {
    return this.categoryService.updateCategory(Number(id), category);
  }

  @Delete(':id')
  removeCategory(@Param('id') id: string) {
    return this.categoryService.removeCategoryTrashed(Number(id));
  }
}
