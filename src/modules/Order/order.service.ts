import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Discount } from 'src/submodules/models/DiscountModel/Discount';
import { Order, OrderDto, TOrderResponse, TOrders } from 'src/submodules/models/OrderModel/Order';
import { UserModel } from '../Auth/auth.schema';
import { DiscountModel } from '../Discount/discount.shema';
import { ProductModel } from '../Product/product.schema';
import { OrderDetailModel } from './dto/orderDetail.schema';
import { OrderQueryDto } from './dto/query-orders';
import { OrderModel } from './order.schema';
import { ResponseError } from 'src/helpers/ResponseError';

@Injectable()
export class OrderService {
    async getOrderAll(query: OrderQueryDto): Promise<TOrders> {
        const limit = query.limit || 6;
        const page = query.page || 1;
        const limited = Number(limit);
        const offset = (Number(page) - 1) * limited;
        const orders = await OrderModel.findAll({});

        const listOrder: Order[] = await OrderModel.findAll({
            limit: limited,
            offset,
            include: [
                {
                    model: UserModel,
                    as: 'users',
                },
            ],
        });

        const totalPage = Math.round(orders.length / limited);

        return {
            totalPage: totalPage,
            limit: limited,
            page: page,
            orders: listOrder,
        };
    }

    async createOrder(orderDto: Partial<OrderDto>): Promise<TOrderResponse> {
        const resultOrder: any = orderDto.orders;
        const dataDetail: any[] = orderDto.orderDetail;

        const detailDt: any[] = dataDetail.map((e) => {
            return {
                productId: e.productId,
                price: e.price,
                quantity: e.quantity,
            };
        });
        let coupon: number = 0;

        if (resultOrder?.orderCode) {
            const discount: Discount = await DiscountModel.findOne({
                where: { code: resultOrder?.orderCode },
            });
            if (!discount) throw ResponseError.notFound('discount not found');
            if (discount?.number_used >= discount.limit_number)
                throw new HttpException('discount limited value', HttpStatus.FORBIDDEN);
            if (resultOrder.money < discount.payment_limit)
                throw new HttpException('discount  maximum value', HttpStatus.FORBIDDEN);
            coupon = Number(discount.discount);
        }

        resultOrder.coupon = coupon;

        const priceTotal = detailDt.reduce((total, current) => total + current.price * current.quantity, 0);
        resultOrder.money = priceTotal;

        // resultOrder.price_ship = resultOrder.money - resultOrder.coupon;
        let results = await OrderModel.create(resultOrder).then(async (res) => {
            let id = await res.get().id;
            detailDt.map((detailDt) => {
                return (detailDt.orderID = id);
            });

            const detailData = await OrderDetailModel.bulkCreate(detailDt);
            return { result: res, detailData };
        });

        return results;
    }

    async getOrderDetailByOrder(id: number): Promise<any> {
        const detailedOrder = await OrderModel.findAll({
            include: [
                {
                    model: OrderDetailModel,
                    as: 'orderDetail',
                    include: [
                        {
                            model: ProductModel,
                            as: 'product',
                        },
                    ],
                },
            ],
            where: {
                id: id,
            },
        });
        return detailedOrder[0];
    }

    async getOrderbyUser(id: number): Promise<OrderDto[]> {
        const orderCurrent = await OrderModel.findAll({
            include: [
                {
                    attributes: ['fullName'],
                    model: UserModel,
                    as: 'users',
                },
                {
                    model: OrderDetailModel,
                    as: 'orderDetail',
                    include: [
                        {
                            model: ProductModel,
                            as: 'product',
                        },
                    ],
                },
            ],

            where: {
                userID: id,
            },
        });
        return orderCurrent;
    }

    async delete(id: number) {
        await OrderModel.destroy({
            where: { id: Number(id) },
        });
    }

    async updateOrder(id: number, status: any) {
        await OrderModel.update(
            { status: status.status },
            {
                where: {
                    id: Number(id),
                },
            }
        );
    }
}
