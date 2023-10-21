import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ApiTags } from "@nestjs/swagger";
import { OrderDto } from "src/submodules/models/OrderModel/Order";
@ApiTags("payment")
@Controller("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  @Post("/payment-url")
  public async getPayment(@Body() orderDto: OrderDto) {
    return this.paymentService.getPayment(orderDto);
  }
}
