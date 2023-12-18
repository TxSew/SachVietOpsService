import { Injectable } from '@nestjs/common';
import { ResponseError } from 'src/helpers/ResponseError';
import { Voucher } from 'src/submodules/models/voucherModel/Voucher';
import { UserModel } from '../auth/auth.schema';
import { DiscountModel } from '../discount/discount.shema';
import { VoucherModel, voucherModel } from './voucher.schema';
import moment from 'moment';
import { Op } from 'sequelize';
import { SequelizeBase } from 'src/configs/SequelizeConfig';

@Injectable()
export class VoucherService {
    async getAllVoucherByUser(id) {
        const currentDate = new Date();

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
                    where: {
                        expiration_date: {
                            [Op.gte]: currentDate,
                        },
                        number_used: {
                            [Op.lte]: SequelizeBase.literal(
                                `(SELECT limit_number FROM db_discount WHERE db_discount.id = discountVoucher.id AND conditions_to_match)`
                            ),
                        },
                    },
                },
            ],
            where: {
                userId: id,
            },
        });
        return discount;
    }

    async getAllVoucherByUserIsNull(id) {
        const currentDate = new Date();
        const relatedDate = (value: any) => new Date(value);
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
                    where: {
                        expiration_date: {
                            [Op.gte]: currentDate, // Ensuring expiration date is greater than or equal to the current date
                        },
                    },
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

        if (Date.now() > discountVoucher.expiration_date) {
            throw ResponseError.badInput('payment date exceeded');
        }
        if (discountVoucher?.number_used >= discountVoucher.limit_number)
            throw ResponseError.badInput('discount limited value');

        if (order.money < discountVoucher.payment_limit)
            throw ResponseError.badInput({
                result: {
                    message: 'payment limit exceeded',
                    value: discountVoucher.payment_limit,
                },
            });

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
