import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ResponseError } from 'src/helpers/ResponseError';
import { Discount } from 'src/submodules/models/DiscountModel/Discount';
import { Order, OrderDto, TOrderResponse, TOrders } from 'src/submodules/models/OrderModel/Order';
import { UserModel } from '../auth/auth.schema';
import { DiscountModel } from '../discount/discount.shema';
import { ProductModel } from '../product/product.schema';
import { OrderDetailModel } from './dto/orderDetail.schema';
import { OrderQueryDto } from './dto/query-orders';
import { OrderModel } from './order.schema';

@Injectable()
export class OrderService {
    async getOrderAll(props: OrderQueryDto): Promise<TOrders> {
        const limit = props.limit || 6;
        const page = props.page || 1;
        const search = props.keyword || '';
        const limited = Number(limit);
        const offset = (Number(page) - 1) * limited;
        const orders = await OrderModel.findAll({});
        let isWhere: {};
        let isSearchUser: {};
        if (search) {
            isWhere = {
                [Op.or]: [{ id: { [Op.like]: `${search}` } }, { phone: { [Op.like]: `${search}` } }],
            };

            isSearchUser = {
                [Op.or]: [{ fullName: { [Op.like]: `%${search}%` } }],
            };
        }
        const listOrder: Order[] = await OrderModel.findAll({
            where: isWhere,
            limit: limited,
            offset,
            order: [[props.sortBy || 'createdAt', props.sortWith || 'DESC']],
            include: [
                {
                    model: UserModel,
                    as: 'users',
                    where: isSearchUser,
                },
            ],
        });
        const totalPage = Math.round(orders.length / limited);
        return {
            totalPage: totalPage,
            limit: limited,
            page: page,
            pageSize: listOrder.length,
            orders: listOrder,
        };
    }
    async getOrderUser(id: number, props) {
        console.log('🚀 ~ file: order.service.ts:56 ~ OrderService ~ getOrderUser ~ props:', props);
        const limit = props.limit || 6;
        const page = props.page || 1;
        const limited = Number(limit);
        const offset = (Number(page) - 1) * limited;
        const orders = await OrderModel.findAll({});

        const orderCurrent = await OrderModel.findAll({
            limit: limited,
            offset: offset,
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
            order: [['createdAt', 'DESC']],
            where: {
                userID: id,
            },
        });
        const totalPage = Math.round(orders.length / limited);

        return {
            totalPage: totalPage,
            limit: limited,
            page: page,
            data: orderCurrent,
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

    async getOrderbyUser(props, id: number) {
        const limit = props.limit || 6;
        const page = props.page || 1;
        const limited = Number(limit);
        const offset = (Number(page) - 1) * limited;
        const orders = await OrderModel.findAll({});

        const orderCurrent = await OrderModel.findAll({
            limit: limited,
            offset: offset,
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
            order: [['createdAt', 'DESC']],
            where: {
                userID: id,
            },
        });
        const totalPage = Math.round(orders.length / limited);

        return {
            totalPage: totalPage,
            limit: limited,
            page: page,
            data: orderCurrent,
        };
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
    async updateOrderUser(id: number, account: number) {
        if (!account) throw ResponseError.unauthorized('authorization orderUser');
        if (!id) throw ResponseError.unauthorized('orderId not value');
        const order = await OrderModel.update(
            { status: 0 },
            {
                where: {
                    id: Number(id),
                },
            }
        );
        return order;
    }
}
