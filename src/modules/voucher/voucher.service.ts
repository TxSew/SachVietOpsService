import { Injectable } from '@nestjs/common';
import { ResponseError } from 'src/helpers/ResponseError';
import { Voucher } from 'src/submodules/models/voucherModel/Voucher';
import { UserModel } from '../auth/auth.schema';
import { DiscountModel } from '../discount/discount.shema';
import { VoucherModel } from './voucher.schema';
import { Op } from 'sequelize';

@Injectable()
export class VoucherService {
    async getAllVoucherByUser(id) {
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
            where: {
                userId: id,
            },
        });
        return discount;
    }
    async getAllVoucherByUserIsNull(id) {
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
            where: {
                userId: id,
                status: null,
            },
        });
        return discount;
    }

    async addVoucherUser(props: Voucher, account) {
        if (!account) throw ResponseError.badInput('authorization');

        const discount = await VoucherModel.findOne({
            where: { discountId: props.discountId, userId: account.id },
        });

        if (discount) throw ResponseError.badInput('voucher already exists');

        const data = {
            ...props,
            userId: account.id,
        };

        const vouchers = await VoucherModel.create(data);
        return vouchers;
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
