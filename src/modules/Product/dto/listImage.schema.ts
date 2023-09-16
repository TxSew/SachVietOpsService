import { DataTypes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Product } from 'src/submodules/models/ProductModel/Product';
export interface Models extends Product, Model {}
export const ImagesProductModel = SequelizeBase.define<Models>(
  'db_imagesproduct',
  {
      productId: {
        type: DataTypes.INTEGER,
      },
    ...baseAttributes,
    image: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    deleteAt: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
);
