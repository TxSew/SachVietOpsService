import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Public } from 'src/guard/jwtGuard';
import { Discount } from 'src/submodules/models/DiscountModel/Discount';
import { DiscountService } from './discount.service';

@ApiTags('discount')
@UseGuards(JwtAuthGuard)
@Controller('discount')
export class DiscountController {
    constructor(private discountService: DiscountService) {}

    @Public()
    @Post('')
    getDiscount(@Body() props) {
        return this.discountService.GetAll(props);
    }

    @Get(':id')
    getOneDiscount(@Param('id') id: number) {
        return this.discountService.getOneUpdateDiscount(id);
    }

    @Post('store')
    createDiscount(@Body() discount: Discount) {
        return this.discountService.createDiscount(discount);
    }

    @Put('update/:id')
    updateDiscount(@Param('id') id: number, @Body() discount: Discount) {
        return this.discountService.updateDiscount(id, discount);
    }

    @Post('checkDiscount')
    checkDiscount(@Param('id') id: number) {}

    @Delete(':id')
    removeDiscount(@Param('id') id: number) {
        return this.discountService.removeDiscount(id);
    }
}
