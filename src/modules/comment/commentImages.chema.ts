import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { CommentImg } from 'src/submodules/models/CommentModel/Comment';
import { CommentModel } from './comment.schema';
interface CommentImageSchema extends Model<InferAttributes<CommentImg>, InferCreationAttributes<CommentImg>> {}
export const CommentImgModel = SequelizeBase.define<CommentImageSchema>(
    'db_imageComment',
    {
        commentId: {
            type: DataTypes.INTEGER,
        },
        images: {
            type: DataTypes.STRING,
        },
    },
    {
        freezeTableName: true,
        paranoid: true,
    }
);
// CommentImgModel.belongsTo(CommentModel, {
//     foreignKey: 'commentId', // This should match the foreign key in OrderDetail that links to Product
//     as: 'comment', // Use any alias you prefer
// });
