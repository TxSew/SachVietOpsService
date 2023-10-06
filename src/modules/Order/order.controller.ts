import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import {
  Order,
  OrderDto,
  TOrderResponse,
  TOrders,
} from "src/submodules/models/OrderModel/Order";
import { OrderQueryDto } from "./dto/query-orders";

@ApiTags("order")
@Controller("order")
export class OrderController {
  constructor(private orderService: OrderService) {}
  @Get("")
  getOrderHistory(@Query() query: OrderQueryDto): Promise<TOrders> {
    return this.orderService.getOrderAll(query);
  }
  @Get("orderDetail/:id")
  getOrderDetail(@Param("id") id: number) {
    return this.orderService.getOrderDetailByOrder(id);
  }
  @Get("current/:id")
  getOrderCUrrent(@Param("id") id: number): Promise<any> {
    return this.orderService.getOrderByCurrent(Number(id));
  }
  @ApiOperation({ summary: "Order product" })
  @ApiCreatedResponse({ description: " Order successfully." })
  @Post("store")
  addOrder(@Body() OrderDto: OrderDto): Promise<TOrderResponse> {
    return this.orderService.createOrder(OrderDto);
  }
  @Post("update/:id")
  updateOrder(@Param("id") id: number, @Body() status: number) {
    console.log(id, status);
    return this.orderService.update(id, status);
  }
  @Delete(":id")
  RemoveOrder(@Param("id") id: number) {
    this.orderService.RemoveOrder(id);
  }
}
