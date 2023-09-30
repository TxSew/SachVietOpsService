import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  Order,
  OrderDto,
  TOrderResponse,
} from 'src/submodules/models/OrderModel/Order';
import { UserModel } from '../Auth/auth.schema';
import { ProductModel } from '../Product/product.schema';
import { OrderDetailModel } from './dto/orderDetail.schema';
import { OrderModel } from './order.schema';
import { Discount } from 'src/submodules/models/DiscountModel/Discount';
import { DiscountModel } from '../Discount/discount.shema';

@Injectable()
export class OrderService {
  //  constructor (private order: OrderController){}
  async getOrderAll(): Promise<Order[]> {
    try {
      const listOrder = await OrderModel.findAll({
        include: [
          {
            model: UserModel,
            as: 'users',
          },
        ],
      });
      return listOrder;
    } catch (error) {
      throw 'errors: ' + error;
    }
  }

  async createOrder(orderDto: OrderDto): Promise<TOrderResponse> {
    const resultOrder: any = orderDto.orders;
    const dataDetail: any[] = orderDto.orderDetail;
    if (resultOrder?.orderCode) {
      const discount: Discount = await DiscountModel.findOne({
        where: { orderCode: resultOrder?.orderCode },
      });
      if (!discount) {
        throw new HttpException('discount not found', HttpStatus.FORBIDDEN);
      }
      if (discount?.number_used >= discount.limit_number) {
        throw new HttpException(
          'discount limited value ',
          HttpStatus.FORBIDDEN,
        );
      }
      if (resultOrder.price < discount.payment_limit) {
        throw new HttpException(
          'discount  maximum value',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    try {
      const priceTotal = dataDetail.reduce(
        (total, current) => total + current.price * current.count,
        0,
      );
      resultOrder.money = priceTotal;

      let results = await OrderModel.create(resultOrder).then(async (res) => {
        let Id = await res.get().id;
        for (var i = 0; i < dataDetail.length; i++) {
          dataDetail[i].orderID = Id;
        }
        const detailData = await OrderDetailModel.bulkCreate(dataDetail);
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
    console.log(detailedOrder);
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
      },
    );
  }
}

//  const order: Order = {
//   address: "",
//   OrderDetails: [
//     {
//       orderID: null,
//       price: 2,
//     }
//   ]
//  }

// const toCreateOrder = await OrderModel.create({...order}, {
//   include: [{
//     model: OrderDetailModel,
//     as: "OrderDetailModel"
//   }]
//  })
