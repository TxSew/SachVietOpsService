import { Body, Controller, Get, Post, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Order, OrderDto, TOrderResponse, TOrders } from 'src/submodules/models/OrderModel/Order';
import { OrderQueryDto } from './dto/query-orders';
import { Public } from 'src/guard/jwtGuard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CurrentAccount } from 'src/guard/currentUser';

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
    @UseInterceptors(CacheInterceptor)
    @Get('orderDetail/:id')
    getOrderDetail(@Param('id') id: number) {
        return this.orderService.getOrderDetailByOrder(id);
    }

    @UseInterceptors(CacheInterceptor)
    @Post('current')
    getOrderCUrrent(@Body() props, @CurrentAccount() account) {
        console.log(account);
        return this.orderService.getOrderbyUser(props, Number(account.id));
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

    @Post('updateOrderUser/:id')
    updateOrderUser(@Param('id') id: number, @CurrentAccount() account) {
        return this.orderService.updateOrderUser(id, account.id);
    }

    @Public()
    @Delete(':id')
    RemoveOrder(@Param('id') id: number) {
        this.orderService.delete(id);
    }
}
