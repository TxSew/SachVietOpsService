import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Discount } from "src/submodules/models/DiscountModel/Discount";
import {
  Order,
  OrderDto,
  TOrderResponse,
  TOrders,
} from "src/submodules/models/OrderModel/Order";
import { UserModel } from "../Auth/auth.schema";
import { DiscountModel } from "../Discount/discount.shema";
import { ProductModel } from "../Product/product.schema";
import { OrderDetailModel } from "./dto/orderDetail.schema";
import { OrderQueryDto } from "./dto/query-orders";
import { OrderModel } from "./order.schema";

@Injectable()
export class OrderService {
  async getOrderAll(query: OrderQueryDto): Promise<TOrders> {
    const limit = query.limit || 6;
    const page = query.page || 1;
    const limited = Number(limit);
    const offset = (Number(page) - 1) * limited;
    const searchQuery = query.keyword || "";
    const orders = await OrderModel.findAll({});
    try {
      const listOrder: Order[] = await OrderModel.findAll({
        limit: limited,
        offset,
        include: [
          {
            model: UserModel,
            as: "users",
          },
        ],
      });
      const totalPage = Math.round((await orders.length) / limited);
      return {
        totalPage: totalPage,
        limit: limited,
        page: page,
        orders: listOrder,
      };
    } catch (error) {
      throw "errors: " + error;
    }
  }
  public async createOrder(
    orderDto: Partial<OrderDto>
  ): Promise<TOrderResponse> {
    const resultOrder: any = orderDto.orders;

    const dataDetail: any[] = orderDto.orderDetail;
    console.log("orders", orderDto);

    const detailDt = dataDetail.map((e) => {
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
      if (!discount) {
        throw new HttpException("discount not found", HttpStatus.FORBIDDEN);
      }
      if (discount?.number_used >= discount.limit_number) {
        throw new HttpException("discount limited value", HttpStatus.FORBIDDEN);
      }
      if (resultOrder.money < discount.payment_limit) {
        throw new HttpException(
          "discount  maximum value",
          HttpStatus.FORBIDDEN
        );
      }
      coupon = Number(discount.discount);
    }
    resultOrder.coupon = coupon;
    try {
      const priceTotal = dataDetail.reduce(
        (total, current) => total + current.price * current.quantity,
        0
      );
      resultOrder.money = priceTotal;
      // resultOrder.price_ship = resultOrder.money - resultOrder.coupon;
      let results = await OrderModel.create(resultOrder).then(async (res) => {
        let id = await res.get().id;
        dataDetail.map((dataDetail) => {
          return (dataDetail.orderID = id);
        });
        const detailData = await OrderDetailModel.bulkCreate(detailDt);
        return { result: res, detailData };
      });
      return results;
    } catch (err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN);
    }
  }

  async getOrderDetailByOrder(id: number): Promise<any> {
    const detailedOrder = await OrderModel.findAll({
      include: [
        {
          model: OrderDetailModel,
          as: "orderDetail",
          include: [
            {
              model: ProductModel,
              as: "product",
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
  //  get order by current
  async getOrderByCurrent(id: number): Promise<OrderDto[]> {
    const orderCurrent = await OrderModel.findAll({});
    return orderCurrent;
  }
  // remove order
  async RemoveOrder(id: number) {
    console.log(id);
    const destroyOrder = await OrderModel.destroy({
      where: { id: Number(id) },
    });
    return destroyOrder;
  }
  async update(id: number, status: any) {
    OrderModel.update(
      { status: status.status },
      {
        where: {
          id: Number(id),
        },
      }
    );
  }
}
