import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { New } from 'src/submodules/models/NewModel/New';
class newModel extends Model<InferAttributes<New>, InferCreationAttributes<New>> {}
export const NewsModel = SequelizeBase.define<newModel>(
    'db_news',
    {
        ...baseAttributes,
        title: {
            type: DataTypes.INTEGER,
        },
        desc: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,
            unique: true,
        },
    },
    {
        freezeTableName: true,
    }
);
