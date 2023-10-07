import {DataTypes, InferAttributes, InferCreationAttributes, Model} from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Discount } from 'src/submodules/models/DiscountModel/Discount';
import { Producer } from 'src/submodules/models/producerModel/producer';

 class discount extends Model<InferAttributes<Discount>, InferCreationAttributes<Discount>> {}

export const DiscountModel = SequelizeBase.define<discount>(
  'db_discount',
  {
    ...baseAttributes,
    discount: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
    },
    limit_number: {
      type: DataTypes.INTEGER,
    },
    payment_limit: {
      type: DataTypes.INTEGER,
    },
    number_used: {
      type: DataTypes.INTEGER,
    },
    desc: {
      type: DataTypes.STRING,
    },
    expiration_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  },
);
