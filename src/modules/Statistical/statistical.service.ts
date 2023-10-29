import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { Order } from "src/submodules/models/OrderModel/Order";
import {
  StatisticalDto,
  StatisticalToday,
} from "src/submodules/models/Statistical/Statistical";
import { UserModel } from "../Auth/auth.schema";
import { CategoryModel } from "../Category/category.schema";
import { OrderModel } from "../Order/order.schema";
import { OrderService } from "../Order/order.service";
import { ProducerModel } from "../Producer/producer.schema";
import { ProductModel } from "../Product/product.schema";

@Injectable()
export class StatisticalService {
  constructor(private readonly OrderService: OrderService) {}
  async getTotal(): Promise<StatisticalDto> {
    const [orderCount, productCount, categoryCount, producerCount, UserCount] =
      await Promise.all([
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
    const startDate = new Date(year, month - 1, 1); // Lấy
    const endDate = new Date(year, month, 0); // Lấy ngày cuối cùng của tháng
    // Truy vấn các giao dịch liên quan đến sản phẩm trong khoảng thời gian đã cho
    const orders = await OrderModel.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate], // Sử dụng Op.between để kiểm tra ngày
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
}
