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
  @Post('store')
  createCategory(@Body() category) {
    return this.categoryService.createCategory(category);
  }
  @Put('update/:id')
  updateCategory(@Param('id') id: BaseModel, @Body() category: Category) {
    const idCategory = id.id;
    return this.categoryService.updateCategory(Number(idCategory), category);
  }
  @Delete(':id')
  removeCategory(@Param('id') id: string) {
    console.log(id);

    return this.categoryService.removeCategory(Number(id));
  }
}
