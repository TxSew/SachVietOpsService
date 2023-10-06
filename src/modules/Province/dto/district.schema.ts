import {DataTypes, InferAttributes, Model} from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
export interface Models extends Model {}
export const DistrictModel = SequelizeBase.define<Models>(
  'db_district',
  {
    id: {
      allowNull: true,
      type: DataTypes.NUMBER,
      primaryKey: true,
    },

    type: {
      type: DataTypes.STRING,
    },

    name: {
      type: DataTypes.STRING,
    },
    provinceID: {
      type: DataTypes.NUMBER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);
