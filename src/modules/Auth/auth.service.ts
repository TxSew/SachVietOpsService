import { Injectable, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { appConfig } from 'src/constants/IConfig';
import { JwtAuthGuard, Public } from 'src/guard/jwtGuard';
import { ResponseError } from 'src/helpers/ResponseError';
import { User } from 'src/submodules/models/UserModel/User';
import { UserModel } from './auth.schema';
import { ChangePasswordDTO } from './dto/changePassword.dto';

@Injectable()
@UseGuards(JwtAuthGuard)
export class AccountService {
    constructor(private jwtService: JwtService) {}

    @Public()
    async register(account: Partial<User>): Promise<User> {
        let { email, password } = account;
        if (!email || !password) throw ResponseError.notFound('Please enter your email or password');
        const hash = await this.hashPassword(account.password, 10);
        console.log('🚀 ~ file: auth.service.ts:22 ~ AccountService ~ register ~ hash:', hash);
        account.password = hash;

        const existingUser = await UserModel.findOne({
            where: { email: email },
        });
        if (existingUser) throw ResponseError.badInput('email already exists');

        const register = await UserModel.create(account);
        return register;
    }

    @Public()
    async login(props: { email: string; password: string }) {
        const account = await UserModel.findOne({
            where: { email: props.email },
        }).then((result) => {
            return result.dataValues;
        });

        if (!account) {
            throw ResponseError.notFound('account not found');
        }

        const passwordCompare = await bcrypt.compare(props.password, account.password);
        if (!passwordCompare) throw ResponseError.conflict('Wrong password');

        const access_token = this.generateToken(account.id);

        const { password, ...rest } = account;

        return { account: rest, token: access_token };
    }

    async changePassword(changePassword: ChangePasswordDTO) {
        if (!changePassword) throw ResponseError.badInput('Account not found');
        const { userId, password, newPassword, repeatNewPassword } = changePassword;

        const User = await UserModel.findOne({
            where: { id: userId },
        });

        const isCheckPassword = await this.comparePassword(password, User.get().password);
        if (!isCheckPassword) throw ResponseError.badInput('password is incorrect');
        const isCheck = this.validatePasswordChange(newPassword, repeatNewPassword);
        if (!isCheck) throw ResponseError.badInput('Passwords do not match.');
        const hashPassword = await this.hashPassword(newPassword, 10);
        await UserModel.update(
            { password: hashPassword },
            {
                where: { id: User.get().id },
            }
        );
        return { password: 'Password changed successfully' };
    }

    generateToken(id: number) {
        const access_token = this.jwtService.sign(
            {
                Id: id,
            },
            {
                secret: appConfig.jwt.secret,
            }
        );
        return access_token;
    }

    async hashPassword(password: string, saltOrRounds: number) {
        const hashPassword = await bcrypt.hash(password, saltOrRounds);
        return hashPassword;
    }

    async comparePassword(password: string, password2: string) {
        const comparePassword = await bcrypt.compare(password, password2);
        return comparePassword;
    }

    private validatePasswordChange(newPassword, repeatNewPassword) {
        if (newPassword !== repeatNewPassword) {
            return false;
        }
        return true;
    }
}
