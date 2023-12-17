import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { ResponseError } from 'src/helpers/ResponseError';
import { TUser, User } from 'src/submodules/models/UserModel/User';
import { UserModel } from '../auth/auth.schema';
import { UserQueryDto } from './dto/query-users';
@Injectable()
export class UserService implements OnModuleInit {
    onModuleInit() {}
    public async getUsers(query) {
        const search = query.keyword || '';
        const limit: number = Number(query.limit) || 5;
        const page: number = Number(query.page) || 1;
        const offset = (page - 1) * limit;
        const users = await UserModel.findAll({
            order: [['createdAt', 'DESC']],
        });
        try {
            const GetUsers = await UserModel.findAll({
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                where: {
                    [Op.or]: [{ fullName: { [Op.like]: `%${search}%` } }],
                },
            });
            if (!GetUsers) {
                throw ResponseError.notFound('USer not found');
            }
            let totalPage = Math.ceil(users.length / limit);
            return {
                limit: limit,
                totalPage: totalPage,
                page: page,
                Users: GetUsers,
            };
        } catch (err) {
            throw ResponseError.badInput(err.message);
        }
    }

    async getUserCurrent(email: string): Promise<User> {
        try {
            const userCurrent = await UserModel.findOne({
                where: {
                    email: email,
                },
            });
            if (!userCurrent) {
                throw ResponseError.notFound('User not found');
            }
            return userCurrent;
        } catch (err) {
            throw ResponseError.badInput('Not Found');
        }
    }

    public async updateUserCurrent(id: number, userCurrent: any) {
        try {
            const UserUpdate = await UserModel.update(
                {
                    password: userCurrent,
                },
                {
                    where: { id: id },
                }
            );
            if (!UserUpdate) {
                throw ResponseError.notFound('Not Found user update');
            }
            return UserUpdate;
        } catch (err) {
            throw ResponseError.badInput(`Not Found ${err}`);
        }
    }

    async getMe(id) {
        const User = await UserModel.findOne({
            where: { id: id },
        });
        return User;
    }

    public async updateNewPassword(id: number, newPassword: string): Promise<unknown> {
        try {
            const user = await UserModel.findOne({
                where: {
                    id: id,
                },
            });
            const saltOrRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);
            const updatePass = await UserModel.update(
                { password: hashedPassword },
                {
                    where: { id: user.get().id },
                }
            );
            return updatePass;
        } catch (error) {
            console.log(error);
        }
    }

    async updateUser(props, id) {
        const data = await UserModel.update(props, {
            where: { id: id },
        });
        return {
            message: 'update user successfully ',
        };
    }
}
