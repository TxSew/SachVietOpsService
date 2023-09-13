import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { OrderDto } from 'src/submodules/models/OrderModel/Order';

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
  addOrder(@Body() data: OrderDto):Promise<any> {
    return this.orderService.createOrder(data);
  }
   @Delete('id')
   RemoveOrder(@Param('id') id: number) {
     this.orderService.RemoveOrder(id)
   }


}
