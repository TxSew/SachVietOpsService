import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Order } from 'src/submodules/models/OrderModel/Order';



export interface Models extends Order, Model {}
export const OrderModel = SequelizeBase.define<Models, Order>('db_order', {
  ...baseAttributes,
  userID: {
    type: DataTypes.INTEGER,
  },
   orderDate: {
     type:DataTypes.DATE
   },
  orderCode: {
    type: DataTypes.STRING,
  },
  fullName: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
  },
  money: {
    type: DataTypes.STRING,
  },
  price_ship: {
    type: DataTypes.TEXT,
  },
  coupon: {
    type: DataTypes.INTEGER,
  },
  province: {
    type: DataTypes.INTEGER,
  },
  district: {
    type: DataTypes.INTEGER,
  },

  address: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },

} , {
     freezeTableName:true
});

