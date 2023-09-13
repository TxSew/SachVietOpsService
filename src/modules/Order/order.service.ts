import { Injectable } from '@nestjs/common';
import { Order, OrderDto } from 'src/submodules/models/OrderModel/Order';
import { OrderModel } from './order.schema';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { Sequelize } from 'sequelize';
import { OrderController } from './order.controller';
import { OrderDetailModel } from './dto/orderDetail.schema';
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

  async createOrder(data: OrderDto) {
    console.log(data);
    const resultOrder = data.orders[0];
    const dataDetail = data.orderDetail;
    console.log(dataDetail);
    console.log('existing order', resultOrder);
    let result = await OrderModel.create(resultOrder);
    console.log(result);
    let Id = await result.get().id;
    console.log('id', Id);
    const dataResult = await this.createOrderDetail(dataDetail, Id);
    console.log(dataResult);

    return dataResult;
  }

  async createOrderDetail(data: any[], Id: number): Promise<any[]> {
    this.changeProductId(data, Id);
    console.log(data);
    const detailData = await OrderDetailModel.bulkCreate(data);
    console.log(detailData);
    return detailData;
  }
  async changeProductId(array: any[], newProductId: number) {
    for (var i = 0; i < array.length; i++) {
      array[i].orderID = newProductId;
    }
  }
  //  get order by current
   async getOrderByCurrent(id:number) {
      const orderCurrent = await OrderModel.findOne({
       where:{userID : id}
     }) 
      return orderCurrent
   }
    // remove order
     async RemoveOrder( id:number) {
           const destroyOrder = await OrderModel.destroy({
             where:{id }
           })  
            return destroyOrder
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
