import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { UserModel } from '../Auth/auth.schema';
import CategoryModel from '../Category/category.schema';
import { OrderModel } from '../Order/order.schema';
import { ProducerModel } from '../Producer/producer.schema';
import { ProductModel } from '../Product/product.schema';

@Injectable()
export class StatisticalService {
  async GetTotal(): Promise<any> {
    const [orderCount, categoryCount, producerCount, UserCount] =
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
        categoryCount,
        producerCount,
        UserCount,
      },
    };
  }
 
  async calculateProductRevenueByMonth(
    month: number,
    year: number,
  ) {
    const startDate = new Date(year, month - 1, 1); // Lấy 
    const endDate = new Date(year, month, 0); // Lấy ngày cuối cùng của tháng
    // Truy vấn các giao dịch liên quan đến sản phẩm trong khoảng thời gian đã cho
    const orders = await OrderModel.findAll({
      where: {
       createdAt : {
          [Op.between]: [startDate, endDate], // Sử dụng Op.between để kiểm tra ngày
        },
      },
    })
     console.log("orders: " + orders);
    // Tính toán tổng doanh thu từ các giao dịch
    const productRevenue = orders.reduce((totalRevenue:any, transaction:any) => {
      return totalRevenue + transaction.money;
    }, 0);
    return productRevenue;
  }
}
