import { DataTypes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Producer } from 'src/submodules/models/producerModel/producer';
export interface ProducerSchema extends Producer, Model {}
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
  },
);
