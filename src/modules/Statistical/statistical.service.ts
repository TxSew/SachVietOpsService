import { Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { StatisticalDto } from "src/submodules/models/Statistical/Statistical";
import { UserModel } from "../Auth/auth.schema";
import { CategoryModel } from "../Category/category.schema";
import { OrderModel } from "../Order/order.schema";
import { ProducerModel } from "../Producer/producer.schema";
import { ProductModel } from "../Product/product.schema";
import { OrderService } from "../Order/order.service";

@Injectable()
export class StatisticalService {
  constructor(private readonly OrderService: OrderService) {}
  async GetTotal(): Promise<StatisticalDto> {
    const [orderCount, productCount, categoryCount, producerCount, UserCount] =
      await Promise.all([
        await OrderModel.count({}),
        await ProductModel.count({}),
        await CategoryModel.count({}),
        await ProducerModel.count({}),
        await UserModel.count({}),
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
  async getStatistical(date: Date) {
    const orders = await OrderModel.findAll({}).then(async (res) => {
      const dat = await res.reduce((totalRevenue: number, transaction: any) => {
        return totalRevenue + transaction.money;
      }, 0);
    });
  }
}
