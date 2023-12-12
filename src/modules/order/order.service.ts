import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ResponseError } from 'src/helpers/ResponseError';
import { Discount } from 'src/submodules/models/DiscountModel/Discount';
import { OrderDto, TOrderResponse } from 'src/submodules/models/OrderModel/Order';
import { UserModel } from '../auth/auth.schema';
import { DiscountModel } from '../discount/discount.shema';
import { EmailService } from '../email/email.service';
import { ProductModel } from '../product/product.schema';
import { OrderDetailModel } from './dto/orderDetail.schema';
import { OrderQueryDto } from './dto/query-orders';
import { OrderModel } from './order.schema';
import { SequelizeBase } from 'src/configs/SequelizeConfig';

@Injectable()
export class OrderService {
    constructor(private emailService: EmailService) {}

    async getOrderAll(props: OrderQueryDto) {
        const limit = props.limit || 6;
        const page = props.page || 1;
        const limited = Number(limit);
        const offset = (Number(page) - 1) * limited;

        const search = props.keyword || '';

        let isWhere = {};

        if (props.status == 'null') {
            isWhere = {
                status: {
                    [Op.is]: null,
                },
            };
        } else if (typeof props.status == 'number') {
            isWhere = {
                status: Number(props.status),
            };
        } else {
            isWhere = {};
        }
        if (search) {
            isWhere = {
                [Op.or]: [{ id: { [Op.like]: `${Number(search)}` } }, { phone: { [Op.like]: `${Number(search)}` } }],
            };
        }

        const listOrder = await OrderModel.findAll({
            where: isWhere,
            limit: limited,
            offset,
            order: [[props.sortBy || 'updatedAt', props.sortWith || 'DESC']],
            include: [
                {
                    model: UserModel,
                    as: 'users',
                },
            ],
        });

        const orders = await OrderModel.findAll({
            where: isWhere,
            include: [
                {
                    model: UserModel,
                    as: 'users',
                },
            ],
        });
        const totalPage = Math.ceil(orders.length / limited);
        return {
            totalPage,
            limit: limited,
            orders: listOrder,
        };
    }

    async getOrderUser(id: number, props) {
        const limit = props.limit || 6;
        const page = props.page || 1;
        const limited = Number(limit);
        const offset = (Number(page) - 1) * limited;

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

        const orders = await OrderModel.findAll({
            order: [['createdAt', 'DESC']],
            where: {
                userID: id,
            },
        });
        const totalPage = Math.ceil(orders.length / limited);

        return {
            totalPage,
            limit: limited,
            page: page,
            data: orderCurrent,
        };
    }

    async createOrder(orderDto: Partial<OrderDto>): Promise<TOrderResponse> {
        const transaction = await SequelizeBase.transaction();

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
            const numberUse = (await discount.number_used) + 1;
            const updated = await DiscountModel.update(
                {
                    number_used: numberUse,
                },
                {
                    where: { code: discount.code },
                }
            );
        }

        resultOrder.coupon = coupon;
        const priceTotal = detailDt.reduce((total, current) => total + current.price * current.quantity, 0);
        resultOrder.money = priceTotal;
        try {
            let results = await OrderModel.create(resultOrder).then(async (res) => {
                let id = await res.get().id;
                const data = {
                    subject: 'Order successfully',
                    to: resultOrder.email,
                    template: './order',
                    context: {
                        email: resultOrder.email,
                        code: id,
                    },
                };
                await this.emailService.sendMailTemplate(data);

                detailDt.map((detailDt) => {
                    return (detailDt.orderID = id);
                });

                const detailData = await OrderDetailModel.bulkCreate(detailDt);
                return { result: res, detailData };
            });
            transaction.commit();
            return results;
        } catch (error) {
            transaction.rollback();
            throw ResponseError.unexpected(error.message);
        }
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
        const totalPage = Math.ceil(orders.length / limited);

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
            { status: 3 },
            {
                where: {
                    id: Number(id),
                },
            }
        );
        return order;
    }
}
