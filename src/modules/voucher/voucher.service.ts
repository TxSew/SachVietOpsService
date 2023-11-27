import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseError } from 'src/helpers/ResponseError';
import { Voucher } from 'src/submodules/models/voucherModel/Voucher';
import { UserModel } from '../auth/auth.schema';
import { DiscountModel } from '../discount/discount.shema';
import { VoucherModel } from './voucher.schema';
import { Discount } from 'src/submodules/models/DiscountModel/Discount';

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

    async getOneDiscount(account, order: { code: string; money: number }) {
        const discount = (await VoucherModel.findOne({
            include: [
                {
                    model: DiscountModel,
                    as: 'discountVoucher',
                    where: { code: order.code },
                },
            ],
            where: { userId: account.id },
        })) as any;

        const numberUse = discount.dataValues;
        const discountVoucher = discount.dataValues.discountVoucher.dataValues;

        if (!discount) throw ResponseError.notFound('discount not found');

        if (discountVoucher?.number_used >= discountVoucher.limit_number)
            throw ResponseError.badInput('discount limited value');

        if (order.money < discountVoucher.payment_limit) throw ResponseError.badInput('payment limit exceeded');

        return {
            message: 'success',
            discount: discountVoucher,
        };
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
