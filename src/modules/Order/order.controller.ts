import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Get('')
  getOrderHistory() {
    return this.orderService.getOrderAll();
  }
   @Get('current/:id')
   getOrderCUrrent(@Param('id') id: number) {
     this.orderService.getOrderByCurrent(Number(id))
   }
  @ApiOperation({ summary: 'Order product' })
  @ApiCreatedResponse({ description: ' Order successfully.' })
  @Post('store')
  addOrder(@Body() data) {
    this.orderService.createOrder(data);
  }
   @Delete('id')
   RemoveOrder(@Param('id') id: number) {
     this.orderService.RemoveOrder(id)
   }


}
