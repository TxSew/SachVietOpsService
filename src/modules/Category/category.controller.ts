import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Category } from "src/submodules/models/ProductModel/Category";
import { CategoryService } from "./category.service";
import { CategoryQueryDto } from "./dto/Category.schema";
@ApiTags("category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  getAll(@Query() query: CategoryQueryDto)  {
    return this.categoryService.getAll(query);
  }
  @Get("/listCategory")
  getListCategory() {
    return this.categoryService.getListCategory();
  }
  @Get(':id')
  getOne(@Param() id: number) {
    return this.categoryService.getOne(id);
  }
  @Post('store')
  createCategory(@Body() category: Partial<Category>) {
    return this.categoryService.createCategory(category);
  }
  @Put("update/:id")
  updateCategory(@Param("id") id: number, @Body() category: Category) {
    return this.categoryService.updateCategory(Number(id), category);
  }
  @Delete(":id")
  removeCategory(@Param("id") id: number) {
    return this.categoryService.removeCategoryTrashed(Number(id));
  }
}
