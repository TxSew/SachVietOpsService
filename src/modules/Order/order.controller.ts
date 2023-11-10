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
    @Post('')
    retOrderHistory(@Body() props: OrderQueryDto): Promise<TOrders> {
        return this.orderService.getOrderAll(props);
    }

    @Public()
    @Get('orderDetail/:id')
    getOrderDetail(@Param('id') id: number) {
        return this.orderService.getOrderDetailByOrder(id);
    }

    @Public()
    @Get('current/:id')
    getOrderCUrrent(@Param('id') id: number): Promise<OrderDto[]> {
        return this.orderService.getOrderbyUser(id);
    }

    @Public()
    @Post('store')
    addOrder(@Body() OrderDto: OrderDto): Promise<TOrderResponse> {
        return this.orderService.createOrder(OrderDto);
    }
    @Public()
    @Post('update/:id')
    updateOrder(@Param('id') id: number, @Body() status: number) {
        return this.orderService.updateOrder(id, status);
    }
    @Public()
    @Delete(':id')
    RemoveOrder(@Param('id') id: number) {
        this.orderService.delete(id);
    }
}
