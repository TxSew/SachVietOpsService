import { Injectable } from '@nestjs/common';
import { appConfig } from 'src/constants/IConfig';
import { MyConfigService } from 'src/myConfig.service';
import { OrderDto } from 'src/submodules/models/OrderModel/Order';
import { OrderService } from '../Order/order.service';
const stripe = require('stripe')(
    'sk_test_51NytAnGgD3dbMpsnDslKorNDTNgk3ZT7dn8uEgkZbaXWIaSwXrGQBsxPygvP7SS7gLK5dnQRWSDI8VpAdrEKfvh1001G2Se1OM'
);

@Injectable()
export class PaymentService {
    constructor(
        private orderService: OrderService,
        private configService: MyConfigService,
        private config: MyConfigService
    ) {}
    getCartItems = async (line_items, object, metadata) => {
        return new Promise((resolve, reject) => {
            let cartItems = [];
            let order = {
                iduser: parseInt(metadata.idUser),
                cartItems,
                amount_subtotal: object.amount_subtotal,
                shipping: object.total_details.amount_shipping,
                discount: object.total_details.amount_discount,
                amount_total: object.amount_total,
                method: 'Thẻ tín dụng',
                note: metadata.note,
                invoice: metadata.invoice,
                name: metadata.name,
                address: metadata.address,
                phoneNumber: metadata.phone,
            };
            line_items?.data?.map(async (element) => {
                const product = await stripe.products.retrieve(element.price.product);
                console.log(product);
                const id = parseInt(product.metadata.productId);

                cartItems.push({
                    productId: id,
                    name: product.name,
                    image: product.images[0],
                    price: element.price.unit_amount,
                    quantity: element.quantity,
                    total: element.price.unit_amount * element.quantity,
                });

                if (cartItems.length === line_items?.data.length) {
                    resolve(order);
                }
            });
        });
    };

    async getPayment(orderDto: OrderDto) {
        if (orderDto.paymentMethod == 'COD') {
            const order = await this.orderService.createOrder(orderDto);

            return {
                paymentMethod: 'COD',
                data: order,
                url: `${appConfig.stripe.STRIPE_SUCCESS_URL}/${order.result.id}`,
            };
        }

        if (orderDto.paymentMethod == 'Visa') {
            const line_items = orderDto.orderDetail.map((order) => {
                const parseInt = Math.ceil(order.price);
                return {
                    price_data: {
                        currency: 'vnd',
                        product_data: {
                            name: order.productName,
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
            const customer = await stripe.customers.create({
                metadata: {
                    ...orderDto.orders,
                },
            });

            const session = await stripe.checkout.sessions.create({
                invoice_creation: {
                    enabled: true,
                },
                customer: customer.id,
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
                success_url: appConfig.stripe.STRIPE_CANCEL_URL,
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
        let event = request.body;
        console.log(event);

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const line_items = await stripe.checkout.sessions.listLineItems(event.data.object.id);
                console.log('🚀 ~ file: payment.service.ts:138 ~ PaymentService ~ webhook ~ line_items:', line_items);
                const iduser = await stripe.customers.retrieve(event.data.object.customer);
                console.log('🚀 ~ file: payment.service.ts:139 ~ PaymentService ~ webhook ~ iduser:', iduser);
                const orderItems = await this.getCartItems(line_items, event.data.object, iduser.metadata);
                console.log('🚀 ~ file: payment.service.ts:140 ~ PaymentService ~ webhook ~ orderItems:', orderItems);
        }

        response.json({ received: true });
    }
}
