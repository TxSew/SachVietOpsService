import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Discount } from 'src/submodules/models/DiscountModel/Discount';
import { DiscountService } from './discount.service';
import { Public } from 'src/guard/jwtGuard';

@ApiTags('discount')
@Controller('discount')
export class DiscountController {
    constructor(private discountService: DiscountService) {}

    @Public()
    @Get('')
    getDiscount() {
        return this.discountService.GetAll();
    }

    @Post('store')
    createDiscount(@Body() discount: Discount) {
        return this.discountService.createDiscount(discount);
    }

    @Put('update/:id')
    updateDiscount(@Param('id') id: number, discount: Partial<Discount>) {
        this.discountService.updateDiscount(id, discount);
    }

    @Delete(':id')
    removeDiscount(@Param('id') id: number) {
        return this.discountService.removeDiscount(id);
    }
}
