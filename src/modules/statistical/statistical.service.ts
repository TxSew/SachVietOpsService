import { Injectable } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { Order } from 'src/submodules/models/OrderModel/Order';
import { StatisticalDto, StatisticalToday } from 'src/submodules/models/Statistical/Statistical';
import { UserModel } from '../auth/auth.schema';
import { CategoryModel } from '../category/category.schema';
import { OrderModel } from '../order/order.schema';
import { OrderService } from '../order/order.service';
import { ProducerModel } from '../producer/producer.schema';
import { ProductModel } from '../product/product.schema';

@Injectable()
export class StatisticalService {
    constructor(private readonly OrderService: OrderService) {}
    async getTotal(): Promise<StatisticalDto> {
        const [orderCount, productCount, categoryCount, producerCount, UserCount] = await Promise.all([
            OrderModel.count({}),
            ProductModel.count({}),
            CategoryModel.count({}),
            ProducerModel.count({}),
            UserModel.count({}),
        ]);
        return {
            Statistical: {
                orderCount,
                productCount,
                categoryCount,
                producerCount,
                UserCount,
            },
        };
    }

    async calculateProductRevenueByMonth(month: number, year: number) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const orders = await OrderModel.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
        }).then(async (res) => {
            const dat = await res.reduce((totalRevenue: number, transaction: any) => {
                return totalRevenue + transaction.money;
            }, 0);
            return dat;
        });
        return orders;
    }

    async getStatisticalToday(): Promise<StatisticalToday> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const orders: Order[] = await OrderModel.findAll({
            where: {
                createdAt: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow,
                },
            },
        });
        const totalRevenue = (status: string | number) => {
            return orders.filter((e) => e.status == status);
        };
        const totalMoney = (status: string | number) => {
            return orders
                .filter((e) => e.status === status)
                .reduce((total: number, current: any) => total + current.money, 0);
        };
        return {
            totalMoney: totalMoney(null),
            totalMoneyByCustomer: totalMoney(2),
            orderCountPending: totalRevenue(1).length,
            orderCount: totalRevenue(null).length,
            orderCountByCustomer: totalRevenue(2).length,
        };
    }

    async getTwelveMonths(props): Promise<any> {
        const currentDate = new Date();
        console.log(currentDate);
        const currentYear = currentDate.getFullYear();
        console.log(currentYear);

        const twelveMonthsData = await OrderModel.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('money')), 'revenue'],
            ],
            where: {
                createdAt: {
                    [Op.between]: [new Date(currentYear, 0, 1), new Date(currentYear, 11, 31, 23, 59, 59)],
                },
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
            raw: true,
        });
        return twelveMonthsData;
    }
}
