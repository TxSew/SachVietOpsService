import { BadRequestException, HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { appConfig } from 'src/constants/IConfig';
import { ResponseError } from 'src/helpers/ResponseError';
import { LoginDto, User, userGroup } from 'src/submodules/models/UserModel/User';
import { UserModel } from './auth.schema';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { JwtAuthGuard, Public } from 'src/guard/jwtGuard';

@Injectable()
@UseGuards(JwtAuthGuard)
export class AccountService {
    constructor(private jwtService: JwtService) {}

    @Public()
    async register(account: Partial<User>): Promise<User> {
        const existingUser = await UserModel.findOne({
            where: { email: account.email },
        });
        if (existingUser) {
            throw ResponseError.badInput('email already exists');
        }
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(account.password, saltOrRounds);
        account.password = await hash;

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
        if (!passwordCompare) {
            throw ResponseError.conflict('Wrong password');
        }

        const access_token = this.jwtService.sign(
            { Id: 2 },
            {
                secret: appConfig.jwt.secret,
            }
        );

        const { password, ...rest } = account;

        return { account: rest, token: access_token };
    }

    async changePassword(changeRequestDTO: ChangePasswordDTO) {
        const { userId, password, newPassword, repeatNewPassword } = changeRequestDTO;

        const User = await UserModel.findOne({
            where: { id: userId },
        });

        if (!User) {
            throw new HttpException('not found user', HttpStatus.FORBIDDEN);
        } else {
            const isCheckPassword = await bcrypt.compare(password, User.get().password);
            if (isCheckPassword) {
                const isCheck = this.validatePasswordChange(newPassword, repeatNewPassword);
                if (isCheck) {
                    const saltOrRounds = 10;
                    const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);
                    await UserModel.update(
                        { password: hashedPassword },
                        {
                            where: { id: User.get().id },
                        }
                    );
                    return { password: 'Password changed successfully' };
                }
            } else {
                throw ResponseError.badInput('password is incorrect');
            }
        }
    }

    private validatePasswordChange(newPassword, repeatNewPassword) {
        if (newPassword !== repeatNewPassword) {
            throw new BadRequestException('Passwords do not match.');
        }
        return true;
    }
}
