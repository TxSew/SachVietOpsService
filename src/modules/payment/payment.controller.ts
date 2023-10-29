import { Body, Controller, Post, Request, Response } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrderDto } from "src/submodules/models/OrderModel/Order";
import { PaymentService } from "./payment.service";

@ApiTags("payment")
@Controller("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post("/payment-url")
  public async getPayment(@Body() orderDto: OrderDto) {
    return this.paymentService.getPayment(orderDto);
  }

  @Post("/webhook")
  public async webhook(@Request() request, @Response() response) {
    return this.paymentService.webhook(request, response);
  }
}
