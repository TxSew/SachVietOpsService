import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { appConfig } from 'src/constants/IConfig';
import { ResponseError } from 'src/helpers/ResponseError';
import { User } from 'src/submodules/models/UserModel/User';
import { EmailService } from '../email/email.service';
import { UserModel } from './auth.schema';
import { ChangePasswordDTO } from './dto/changePassword.dto';

@Injectable()
export class AccountService {
    constructor(
        private jwtService: JwtService,
        private emailService: EmailService
    ) {}

    async register(account: Partial<User>) {
        if (!account.email || !account.password) throw ResponseError.notFound('Please enter your email or password');
        const hash = await this.hashPassword(account.password, 10);
        account.password = hash;

        const existingUser = await UserModel.findOne({
            where: { email: account.email },
        });
        if (existingUser) throw ResponseError.badInput('email already exists');

        const user: User = await UserModel.create(account);
        const { password, ...rest } = user;

        const access_token = await this.generateToken(user.get());
        await this.emailService.sendMailTemplate({
            subject: 'welcome email notification',
            to: user.email,
            template: './welcome',
            context: {
                email: user.email,
            },
        });

        return {
            access_token: access_token,
            user: rest,
        };
    }

    async login(props: { email: string; password: string }) {
        const account = await UserModel.findOne({
            where: { email: props.email },
        });

        if (!account) {
            throw ResponseError.notFound('account not found');
        }

        const passwordCompare = await bcrypt.compare(props.password, account.get().password);
        if (!passwordCompare) throw ResponseError.conflict('Wrong password');
        const { password, userGroup, ...rest } = account.get();

        let access_token = this.generateToken(rest);
        let tokenAdmin = this.generateTokenAdmin(rest);
        if (account.get().userGroup == 2) {
            return { role: 'ale@123', account: rest, token: tokenAdmin };
        }

        return { account: rest, token: access_token };
    }

    async changePassword(changePassword: ChangePasswordDTO, id: number) {
        if (!changePassword) throw ResponseError.badInput('Account not found');
        const { password, newPassword, repeatNewPassword } = changePassword;

        const User = await UserModel.findOne({
            where: { id: id },
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
        return { message: 'Password changed successfully' };
    }

    async loginGoogle(props) {
        const account = await UserModel.findOne({
            where: { email: props.email },
        });

        let newUser;
        if (!account) {
            newUser = await UserModel.create(props);
            const passwordCompare = await bcrypt.compare(props.password, account.get().password);
            if (!passwordCompare) throw ResponseError.conflict('Wrong password');
        }

        const { password, userGroup, ...rest } = account.get();

        let access_token = this.generateToken(rest);
        let tokenAdmin = this.generateTokenAdmin(rest);

        if (account.get().userGroup == 2) {
            return { role: 'ale@123', account: rest, token: tokenAdmin };
        }

        return { account: rest, token: access_token };
    }
    async verifyToken(props: { token: string }) {
        const verify = await this.jwtService.verify(props.token, {
            secret: appConfig.jwt.secret,
        });
        return verify;
    }

    generateToken(props: any) {
        const access_token = this.jwtService.sign(props, {
            secret: appConfig.jwt.secret,
        });
        return access_token;
    }
    generateTokenAdmin(props: any) {
        const access_token = this.jwtService.sign(props, {
            secret: appConfig.jwt.secret,
        });
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
