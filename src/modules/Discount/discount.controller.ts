import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { Discount } from 'src/submodules/models/DiscountModel/Discount';
import { ApiTags } from '@nestjs/swagger';
import { DiscountModel } from './discount.shema';

@ApiTags('discount')
@Controller('discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}
  @Get('')
  async getDiscount() {
    return this.discountService.GetAll();
  }
  @Post('store')
  async createDiscount(@Body() discount: Discount): Promise<Discount> {
    return this.discountService.createDiscount(discount);
  }
  @Put('update/:id')
  async updateDiscount(id: number, discount: Partial<Discount>) {
    this.discountService.updateDiscount(id, discount);
  }
}
