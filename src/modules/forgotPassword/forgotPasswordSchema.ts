import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import slugify from "slugify";
import { SequelizeBase } from "src/configs/SequelizeConfig";
import { baseAttributes } from "src/helpers/defineModelFactory";
import { Opt } from "src/submodules/models/OptModel/Opt";

interface TOpt
  extends Model<InferAttributes<Opt>, InferCreationAttributes<Opt>> {}

export const OptModel = SequelizeBase.define<TOpt>(
  "db_token",
  {
    ...baseAttributes,
    email: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);
