import { Injectable } from "@nestjs/common";
import { MyConfigService } from "src/myConfig.service";
import { OrderDto } from "src/submodules/models/OrderModel/Order";
import { OrderService } from "../Order/order.service";

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
      const line_items = orderDto.orderDetail.map((order) => {
        const parseInt = Math.ceil(order.price);
        return {
          price_data: {
            currency: "vnd",
            product_data: {
              name: order.productId,
              images: [order.image],
              metadata: {
                id: order.productId,
              },
            },
            unit_amount: parseInt,
          },
          quantity: order.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        invoice_creation: {
          enabled: true,
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 19000,
                currency: "vnd",
              },
              display_name: "Free shipping",
              delivery_estimate: {
                minimum: {
                  unit: "business_day",
                  value: 3,
                },
                maximum: {
                  unit: "business_day",
                  value: 5,
                },
              },
            },
          },
        ],
        line_items: [...line_items],
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
