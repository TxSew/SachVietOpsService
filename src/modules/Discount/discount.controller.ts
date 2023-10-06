import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Discount } from 'src/submodules/models/DiscountModel/Discount';
import { DiscountService } from './discount.service';

@ApiTags('discount')
@Controller('discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}
  @Get('')
  async getDiscount() {
    return this.discountService.GetAll();
  }
  @Post('store')
  async createDiscount(@Body() discount: Discount) {
    console.log(discount);

    return this.discountService.createDiscount(discount);
  }
  @Put('update/:id')
  async updateDiscount(@Param('id') id: number, discount: Partial<Discount>) {
    this.discountService.updateDiscount(id, discount);
  }
  @Delete(':id')
  async removeDiscount(@Param('id') id: number) {
    this.discountService.removeDiscount(id);
  }
}
