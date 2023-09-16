import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order, OrderDto, TOrderResponse } from 'src/submodules/models/OrderModel/Order';
import { ProductModel } from '../Product/product.schema';
import { OrderDetailModel } from './dto/orderDetail.schema';
import { OrderModel } from './order.schema';

@Injectable()
export class OrderService {
  //  constructor (private order: OrderController){}
  async getOrderAll():Promise<Order[]> {
    try {
      const listOrder = await OrderModel.findAll({});
      return listOrder;
    } catch (error) {
      throw 'errors: ' + error;
    }
  }

  async createOrder(orderDto: OrderDto): Promise<TOrderResponse> {
    try {
      const resultOrder = orderDto.orders[0];
      const dataDetail: any[] = orderDto.orderDetail;
                       
      let result = await OrderModel.create(resultOrder);
      let Id = await result.get().id;
      for (var i = 0; i < dataDetail.length; i++) {
        dataDetail[i].orderID = Id;
      }
      const detailData = await OrderDetailModel.bulkCreate(dataDetail);
      return { result, detailData };
    } catch (err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN);
    }
  }
  async getOrderDetailByOrder(id: number): Promise<any> {
    // const detalOrder = await SequelizeBase.query(`
    //                  SELECT * FROM db_order od JOIN db_orderdetail dt on od.id=dt.orderID join db_products prd on prd.id=dt.productId WHERE od.id = ${id}
    //                  `);
    // return detalOrder[0];
    const detailedOrder = await OrderModel.findAll({
      include: [
        {
          model: OrderDetailModel,
          as: "orderDetail",
          include: [
            {
              model: ProductModel,
               as: "product"
            },
          ],
        },
      ],
      where: {
        id: id,
      },
    });
     console.log(detailedOrder);
      return detailedOrder
  }
  //  get order by current
  async getOrderByCurrent(id: number): Promise<OrderDto[]> {
    const orderCurrent = await OrderModel.findAll({
      where: { userID: id },
    });
    return orderCurrent;
  }
  // remove order
  async RemoveOrder(id: number) {
    const destroyOrder = await OrderModel.destroy({
      where: { id },
    });
    return destroyOrder;
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
