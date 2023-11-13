import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';
import { baseAttributes } from 'src/helpers/defineModelFactory';
import { Voucher } from 'src/submodules/models/voucherModel/Voucher';
import { UserModel } from '../Auth/auth.schema';
import { DiscountModel } from '../Discount/discount.shema';
export class voucherModel extends Model<InferAttributes<Voucher>, InferCreationAttributes<Voucher>> {}

export const VoucherModel = SequelizeBase.define<voucherModel>(
    'db_uservoucher',
    {
        ...baseAttributes,
        userId: { type: DataTypes.INTEGER, primaryKey: true },
        discountId: { type: DataTypes.INTEGER },
        code: { type: DataTypes.STRING, allowNull: false },
    },
    {
        freezeTableName: true,
        paranoid: true,
    }
);

VoucherModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'userVoucher',
});
VoucherModel.belongsTo(DiscountModel, {
    foreignKey: 'discountId',
    as: 'discountVoucher',
});
