import { DataTypes, Model, Sequelize } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { DistrictModel } from './district.schema';
export interface Models extends Model {}
export const ProvinceModel = SequelizeBase.define<Models>(
  'db_province',
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
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);
ProvinceModel.hasMany(DistrictModel, {
  foreignKey: 'provinceID',
  as: 'district',
});
