import { Injectable } from '@nestjs/common';
import { ResponseError } from 'src/helpers/ResponseError';
import { UserModel } from '../Auth/auth.schema';
import { UserAddressModel } from './userAddress.schema';
import { ProvinceModel } from '../Province/dto/province.schema';

@Injectable()
export class UserAddressService {
    async getListByUser(id: number) {
        if (!id) throw ResponseError.unauthorized('user authentication');
        return UserAddressModel.findAll({
            where: {
                userId: id,
            },
        });
    }
    async createUserAddress(props, account) {
        if (!props) throw ResponseError.badInput('UserAddress empty value');
        const user = await UserModel.findOne({
            where: {
                id: account,
            },
        });
        const address = {
            ...props,
            userId: account,
        };

        if (!user) throw ResponseError.notFound('User not found');
        const userAddress = await UserAddressModel.create(address);
        return userAddress;
    }

    async updateUserAddress(account, props) {
        if (!props) throw ResponseError.badInput('UserAddress empty value');
        const userAddress = await UserAddressModel.update(props, {
            where: {
                userId: account,
            },
        });
        return userAddress;
    }
}
