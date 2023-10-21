import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ApiTags } from "@nestjs/swagger";
@ApiTags("payment")
@Controller("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  @Get("/payment-url")
  public async getPayment() {
    return this.paymentService.getPayment();
  }
}
