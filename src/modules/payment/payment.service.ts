import { Injectable, OnModuleInit } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { OrderService } from "../Order/order.service";
import { OrderDto } from "src/submodules/models/OrderModel/Order";
import { MyConfigService } from "src/myConfig.service";

@Injectable()
export class PaymentService {
  constructor(
    private orderService: OrderService,
    private config: MyConfigService
  ) {}
  async getPayment(orderDto: OrderDto) {
    if (orderDto.paymentMethod == "COD") {
      return await this.orderService.createOrder(orderDto);
    }
    console.log(orderDto);
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
        success_url: "https://localhost:8005/checkout/payment",
        cancel_url: "https://books-client-phi.vercel.app/checkout/payment",
      });
      await this.orderService.createOrder(orderDto);
      console.log(session.url);
      return session.url;
    }
  }
}
