import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Producer } from 'src/submodules/models/producerModel/producer';

// export class productModel extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {}
export interface ProducerSchema extends  Model<InferAttributes<Producer> , InferCreationAttributes<Producer>> {}
export const ProducerModel = SequelizeBase.define<ProducerSchema>(
  'db_producer',
  {
    ...baseAttributes,
    name: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
    },
    keyword: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  },
);
