import { DataTypes, Model } from "sequelize";
import { SequelizeBase } from "src/configs/SequelizeConfig";
import { Order } from "src/submodules/models/OrderModel/Order";
import { OrderModel } from "../order.schema";
import { ProductModel } from "src/modules/Product/product.schema";
import { baseAttributes } from "src/helpers/defineModelFactory";

interface IOrderDetailModel extends Order, Model {}

export const OrderDetailModel = SequelizeBase.define<IOrderDetailModel>(
  "db_orderdetail",
  {
    ...baseAttributes,
    orderID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);
OrderDetailModel.belongsTo(ProductModel, {
  foreignKey: "productId", // This should match the foreign key in OrderDetail that links to Product
  as: "product", // Use any alias you prefer
});
