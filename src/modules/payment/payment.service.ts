import { Injectable } from '@nestjs/common';
import { appConfig } from 'src/constants/IConfig';
import { MyConfigService } from 'src/myConfig.service';
import { OrderDto } from 'src/submodules/models/OrderModel/Order';
import { OrderService } from '../order/order.service';
import { OrderModel } from '../order/order.schema';
import { Op } from 'sequelize';

const stripe = require('stripe')(
    'sk_test_51NytAnGgD3dbMpsnDslKorNDTNgk3ZT7dn8uEgkZbaXWIaSwXrGQBsxPygvP7SS7gLK5dnQRWSDI8VpAdrEKfvh1001G2Se1OM'
);

@Injectable()
export class PaymentService {
    private orderId: string;
    constructor(
        private orderService: OrderService,
        private configService: MyConfigService,
        private config: MyConfigService
    ) {}

    getCartItems = async (line_items, object, metadata) => {
        return new Promise((resolve, reject) => {
            let orderDetail = [];

            let order = {
                iduser: parseInt(metadata.idUser),
                orderDetail,
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
                const id = parseInt(product.metadata.id);
                orderDetail.push({
                    productId: id,
                    name: product.name,
                    image: product.images[0],
                    price: element.price.unit_amount,
                    quantity: element.quantity,
                    total: element.price.unit_amount * element.quantity,
                });

                if (orderDetail.length === line_items?.data.length) {
                    resolve(order);
                }
            });
        });
    };

    async getPayment(orderDto: OrderDto) {
        console.log('🚀 ~ file: payment.service.ts:61 ~ PaymentService ~ getPayment ~ orderDto:', orderDto);
        if (orderDto.paymentMethod == 'COD') {
            const order = await this.orderService.createOrder(orderDto);

            return {
                paymentMethod: 'COD',
                data: order,
                url: `${appConfig.stripe.STRIPE_SUCCESS_URL}/${order.result.id}`,
            };
        }

        if (orderDto.paymentMethod == 'Visa') {
            console.log(orderDto);
            const line_items = orderDto.orderDetail.map((order: any) => {
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

            const orderNew = await OrderModel.findOne({
                order: [['createdAt', 'DESC']],
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
                                amount: 0,
                                currency: 'vnd',
                            },
                            display_name: 'Ground shipping',
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
                success_url: `${appConfig.stripe.STRIPE_SUCCESS_URL}/${orderNew.get().id + 1}`,
                cancel_url: `${this.configService.getStripeCancelUrl}`,
            });

            return {
                paymentMethod: 'Visa',
                message: 'Order by Visa successfully',
                url: `${session.url}`,
            };
        }
    }
    async webhook(request, response) {
        let event = request.body;

        switch (event.type) {
            case 'checkout.session.completed':
                const line_items = (await stripe.checkout.sessions.listLineItems(event.data.object.id)) as any;
                const orders = (await stripe.customers.retrieve(event.data.object.customer)) as any;
                const orderItems = (await this.getCartItems(line_items, event.data.object, orders.metadata)) as any;
                const orderDto = {
                    orders: orders.metadata,
                    orderDetail: orderItems.orderDetail,
                };
                const order = (await this.orderService.createOrder(orderDto)) as any;
                this.orderId = order.id;
        }

        response.json({ received: true });
    }
}
