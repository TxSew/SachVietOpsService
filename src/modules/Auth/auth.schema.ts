/**
 * Keep this file in sync with the code in the "Usage of `sequelize.define`"
 * section in /docs/manual/other-topics/typescript.md
 *
 * Don't include this comment in the md file.
 */
import {
  Sequelize,
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { SequelizeConfig } from 'src/configs/SequelizeConfig';
import { Customer } from 'src/models/CustomerModel/Customer';

// We recommend you declare an interface for the attributes, for stricter typechecking
interface CustomerModel extends Model, Customer {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
}
export const CustomerModel = SequelizeConfig.define<CustomerModel>(
  'db_customer',
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  },
);
