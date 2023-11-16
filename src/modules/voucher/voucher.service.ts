import { Injectable } from '@nestjs/common';
import { ResponseError } from 'src/helpers/ResponseError';
import { Voucher } from 'src/submodules/models/voucherModel/Voucher';
import { VoucherModel } from './voucher.schema';
import { DiscountModel } from '../Discount/discount.shema';
import { UserModel, Users } from '../Auth/auth.schema';

@Injectable()
export class VoucherService {
    async getAllVoucherByUser(props: { userId: number }) {
        const discount = await VoucherModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['fullName', 'email', 'id'],
                    as: 'userVoucher',
                },
                {
                    model: DiscountModel,
                    as: 'discountVoucher',
                },
            ],
            where: { userId: props.userId },
        });
        return discount;
    }

    async addVoucherUser(props: Voucher) {
        try {
            const discount = await VoucherModel.findOne({
                where: { discountId: props.discountId, userId: props.userId },
            });

            if (discount) throw ResponseError.badInput('voucher already exists');

            const vouchers = await VoucherModel.create({
                ...props,
            });
            return vouchers;
        } catch (err) {
            throw ResponseError.badInput('voucher already exists');
        }
    }
    async getOneDiscount(account, voucher: Partial<string>) {
        if (!account) throw ResponseError.badInput('account not found');
        const discount = await VoucherModel.findOne({
            include: [
                {
                    model: DiscountModel,
                    as: 'discountVoucher',
                    where: { code: voucher },
                },
            ],
            where: { userId: account.id },
        });
        return discount;
    }
    async deleteVoucherUser(props: { id: number }) {
        await VoucherModel.destroy({
            where: { id: props.id },
        });
        return {
            message: 'delete voucher successfully',
        };
    }
}
