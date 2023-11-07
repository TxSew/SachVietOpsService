import { Body, Controller, Get, Post, Param, Delete, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Order, OrderDto, TOrderResponse, TOrders } from 'src/submodules/models/OrderModel/Order';
import { OrderQueryDto } from './dto/query-orders';
import { Public } from 'src/guard/jwtGuard';

@ApiTags('order')
@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Public()
    @Get('')
    retOrderHistory(@Query() query: OrderQueryDto): Promise<TOrders> {
        return this.orderService.getOrderAll(query);
    }

    @Public()
    @Get('orderDetail/:id')
    getOrderDetail(@Param('id') id: number) {
        return this.orderService.getOrderDetailByOrder(id);
    }

    @Public()
    @Get('current/:id')
    getOrderCUrrent(@Param('id') id: number): Promise<OrderDto[]> {
        return this.orderService.OrderByUser(id);
    }

    @Public()
    @ApiOperation({ summary: 'Order product' })
    @ApiCreatedResponse({ description: ' Order successfully.' })
    @Post('store')
    addOrder(@Body() OrderDto: OrderDto): Promise<TOrderResponse> {
        return this.orderService.createOrder(OrderDto);
    }
    @Public()
    @Post('update/:id')
    updateOrder(@Param('id') id: number, @Body() status: number) {
        return this.orderService.update(id, status);
    }
    @Public()
    @Delete(':id')
    RemoveOrder(@Param('id') id: number) {
        this.orderService.RemoveOrder(id);
    }
}
