import { Injectable } from '@nestjs/common';
import { MyConfigService } from 'src/myConfig.service';
import { OrderDto } from 'src/submodules/models/OrderModel/Order';
import { OrderService } from '../Order/order.service';
import { appConfig } from 'src/constants/IConfig';

@Injectable()
export class PaymentService {
    constructor(
        private orderService: OrderService,
        private configService: MyConfigService,
        private config: MyConfigService
    ) {}
    async getPayment(orderDto: OrderDto) {
        if (orderDto.paymentMethod == 'COD') {
            const order = await this.orderService.createOrder(orderDto);
            return {
                paymentMethod: 'COD',
                data: order,
                url: appConfig.cod.COD_SUCCESS,
            };
        }

        if (orderDto.paymentMethod == 'Visa') {
            const stripe = require('stripe')(this.config.getStripeSecretKey);
            const line_items = orderDto.orderDetail.map((order) => {
                const parseInt = Math.ceil(order.price);
                return {
                    price_data: {
                        currency: 'vnd',
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

            // Pass the appearance object to the Elements instance

            const session = await stripe.checkout.sessions.create({
                invoice_creation: {
                    enabled: true,
                },
                customer_email: 'thanhdq2003@gmail.com',
                shipping_options: [
                    {
                        shipping_rate_data: {
                            type: 'fixed_amount',
                            fixed_amount: {
                                amount: 19000,
                                currency: 'vnd',
                            },
                            display_name: 'Free shipping',
                            delivery_estimate: {
                                minimum: {
                                    unit: 'business_day',
                                    value: 3,
                                },
                                maximum: {
                                    unit: 'business_day',
                                    value: 5,
                                },
                            },
                        },
                    },
                ],

                line_items: [...line_items],
                mode: 'payment',
                success_url: this.configService.getStripeSuccessUrl,
                cancel_url: this.configService.getStripeCancelUrl,
            });

            return {
                paymentMethod: 'Visa',
                message: 'Order by Visa successfully',
                url: session.url,
            };
        }
    }
    async webhook(request, response) {
        const event = request.body;
        console.log(event);

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('PaymentIntent was successful!');
                break;
            case 'payment_method.attached':
                const paymentMethod = event.data.object;
                console.log('PaymentMethod was attached to a Customer!');
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        response.json({ received: true });
    }
}
