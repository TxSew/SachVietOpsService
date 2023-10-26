import { Injectable } from "@nestjs/common";
import { MyConfigService } from "src/myConfig.service";
import { OrderDto } from "src/submodules/models/OrderModel/Order";
import { OrderService } from "../Order/order.service";

@Injectable()
export class PaymentService {
  constructor(
    private orderService: OrderService,
    private configService: MyConfigService,
    private config: MyConfigService
  ) {}
  async getPayment(orderDto: OrderDto) {
    if (orderDto.paymentMethod == "COD") {
      return await this.orderService.createOrder(orderDto);
    }
    if (orderDto.paymentMethod == "Visa") {
      const stripe = require("stripe")(this.config.getStripeSecretKey);
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "thanh do",
              },
              unit_amount: 33333,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: this.configService.getStripeSuccessUrl,
        cancel_url: this.configService.getStripeCancelUrl,
      });
      await this.orderService.createOrder(orderDto);
      console.log(session.url);
      return session.url;
    }
  }
}
