import { HttpException, Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import * as moment from "moment";
import * as querystring from "qs";
import { ResponseError } from "src/helpers/ResponseError";

@Injectable()
export class PaymentService {
  async getPayment() {
    // Set your secret key. Remember to switch to your live secret key in production.
    // See your keys here: https://dashboard.stripe.com/apikeys
    const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shop",
              categ: "299393",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://books-client-phi.vercel.app/checkout/payment",
      cancel_url: "https://books-client-phi.vercel.app/checkout/payment",
    });
    if (!session) {
      throw ResponseError.badInput("error");
    }
    return session.url;
  }
}
