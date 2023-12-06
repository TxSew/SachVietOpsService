import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseError } from 'src/helpers/ResponseError';
import { MyConfigService } from 'src/myConfig.service';
import { EmailDto, Otp } from 'src/submodules/models/OptModel/Opt';
import { UserService } from '../user/user.service';
import { CreateEmailDto } from '../email/dto/create-email';
import { EmailService } from '../email/email.service';
import { CreateOtpDto } from './dto/create-otp';
import { NewPasswordDTO } from './dto/newPasswordDto';
import { OptModel } from './forgotPasswordSchema';

@Injectable()
export class OtpService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UserService,
        private readonly emailService: EmailService
    ) {}
    async sendEMailOtp(emailDto: Partial<EmailDto>): Promise<any> {
        const user = await this.usersService.getUserCurrent(emailDto.email);
        if (!user) throw ResponseError.badInput('User not found');

        const otp = new CreateOtpDto();
        otp.email = user.email;
        otp.code = this.generateOTP();
        otp.id = user.get().id;

        const email = new CreateEmailDto();
        email.to = user.email;

        const data = {
            subject: 'Password Reset OTP',
            to: email.to,
            template: './forgot-password',
            context: {
                email: email.to,
                otp: otp.code,
            },
        };
        await this.emailService.sendMailTemplate(data);
        const payload = { email: user.email };

        const forgotPasswordToken = this.jwtService.sign(payload, {
            secret: 'forgotPassword',
            expiresIn: Math.floor(Date.now() / 1000) + 3 * 60,
        });
        otp.token = forgotPasswordToken;
        await this.createOtp(otp);
        return { forgot_password_token: forgotPasswordToken };
    }
    async verifyOtpAndResetPassword(props: { email: string; otp: string; password: string }) {
        try {
            const getToken = (await OptModel.findOne({
                where: { email: props.email },
            }).then((res) => {
                return res;
            })) as any;
            const decoded = await this.jwtService.verify(getToken.token, {
                secret: 'forgotPassword',
            });

            const otpItem = await this.findOtpByEmail(decoded.email);

            if (props.otp !== otpItem.code) throw ResponseError.conflict('Invalid OTP Code');

            const user = await this.usersService.getUserCurrent(props.email);
            if (!user.dataValues) throw ResponseError.notFound('User not found');

            await this.usersService.updateNewPassword(user.dataValues.id, props.password);
            return {
                message: 'success',
            };
        } catch (err) {
            return err;
        }
    }

    // handle functions
    async createOtp(createOtpDto: CreateOtpDto): Promise<any> {
        const createdOtp = await OptModel.upsert(createOtpDto);
        return createdOtp;
    }

    private generateOTP(): string {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < 6; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    }

    private async findOtpByEmail(email: string) {
        const otp = await OptModel.findOne({
            where: { email: email },
            order: [['createdAt', 'DESC']],
        });
        if (!otp) {
            throw ResponseError.badInput('OTP not found');
        }
        return otp.dataValues;
    }
    private async removeOtpByEmail(email: string): Promise<void> {
        await OptModel.destroy({ where: { email: email } });
    }
}
