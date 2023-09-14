import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { OrderDto } from 'src/submodules/models/OrderModel/Order';
import { OrderDetailModel } from './dto/orderDetail.schema';
import { OrderModel } from './order.schema';
// import { OrderModel } from './dto/OrderAssociations';

@Injectable()
export class OrderService {
  //  constructor (private order: OrderController){}
  async getOrderAll() {
    try {
      const listOrder = await OrderModel.findAll({});
      return listOrder;
    } catch (error) {
      throw 'errors: ' + error;
    }
  }

  async createOrder(orderDto: OrderDto): Promise<any> {
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
    const detalOrder = await SequelizeBase.query(`
                     SELECT * FROM db_order od JOIN db_orderdetail dt on od.id=dt.orderID join db_products prd on prd.id=dt.productId WHERE od.id = ${id}
                     `);
    return detalOrder[0];
  }
  //  get order by current
  async getOrderByCurrent(id: number): Promise<any> {
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
