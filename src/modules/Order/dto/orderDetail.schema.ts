import { DataTypes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { Order } from 'src/submodules/models/OrderModel/Order';

interface IOrderDetailModel extends Order, Model {}

export const OrderDetailModel = SequelizeBase.define<IOrderDetailModel>('db_orderdetail', {
  orderID: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  count: {
    type: DataTypes.STRING,
  },
   price:{
    type: DataTypes.STRING,
     
   },
    createdAt: {
       type : DataTypes.STRING,
    },
   updatedAt: {
    type: DataTypes.STRING,
   },

  deleteAt: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
} , {
  
     freezeTableName:true
});
