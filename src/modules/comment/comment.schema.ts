import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { Comment } from 'src/submodules/models/CommentModel/Comment';
import { UserModel } from '../auth/auth.schema';
import { ProductModel } from '../product';
import { CommentImgModel } from './commentImages.chema';
interface CommentSchema extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {}
export const CommentModel = SequelizeBase.define<CommentSchema>(
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
        image: {
            type: DataTypes.STRING,
        },
        star: {
            type: DataTypes.INTEGER,
        },
    },
    {
        freezeTableName: true,
    }
);

CommentModel.belongsTo(UserModel, {
    as: 'userComment',
    foreignKey: 'userId',
});

CommentModel.belongsTo(ProductModel, {
    as: 'productComment',
    foreignKey: 'productId',
});
CommentModel.hasMany(CommentImgModel, {
    as: 'comment',
    foreignKey: 'commentId',
});
