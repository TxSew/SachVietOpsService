import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/submodules/models/UserModel/User';
import { EmailService } from '../email/email.service';
import { AccountService } from './auth.service';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { LoginRequestDTO } from './dto/loginRequest.dto';
import { JwtAuthGuard, Public } from 'src/guard/jwtGuard';
@ApiTags('Auth')
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private emailService: EmailService
    ) {}

    @Public()
    @Post('register')
    async create(@Body() register: User): Promise<User> {
        const dataRegis = await this.accountService.register(register);
        await this.emailService.sendMailTemplate({
            subject: 'welcome email notification',
            to: dataRegis.email,
            template: './welcome',
            context: {
                email: register.email,
            },
        });
        return dataRegis;
    }
    @Public()
    @Post('Login')
    Login(@Body() props: { email: string; password: string }) {
        return this.accountService.login(props);
    }

    @Put('changePassword')
    ChangePassword(@Body() changePasswordDto: ChangePasswordDTO) {
        return this.accountService.changePassword(changePasswordDto);
    }
}
