import { DataTypes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Product } from 'src/submodules/models/ProductModel/Product';
import { ProductModel } from '../product.schema';
export interface Models extends Model {}
export const ImagesProductModel = SequelizeBase.define<Models>(
  'db_imagesproduct',
  {
    ...baseAttributes,
    productId: {
      type: DataTypes.INTEGER,
      // primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    freezeTableName: true,
  },
);
