import { DataTypes } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
export const CommentModel = SequelizeBase.define<any>(
    'db_comment',
    {
        userId: {
            type: DataTypes.INTEGER,
        },
        productId: {
            type: DataTypes.INTEGER,
        },
        content: {
            type: DataTypes.STRING,
        },
        images: {
            type: DataTypes.STRING,
        },
        star: {
            type: DataTypes.INTEGER,
        },
    },
    {
        freezeTableName: true,
        paranoid: true,
    }
);
