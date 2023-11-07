import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Public } from 'src/guard/jwtGuard';
import { User } from 'src/submodules/models/UserModel/User';
import { EmailService } from '../email/email.service';
import { AccountService } from './auth.service';
import { ChangePasswordDTO } from './dto/changePassword.dto';
@ApiTags('Auth')
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Public()
    @Post('verifyToken')
    verifyToken(@Body() props: { token: string }) {
        return this.accountService.verifyToken(props);
    }

    @Public()
    @Post('register')
    async create(@Body() register: User) {
        const dataRegis = await this.accountService.register(register);
        return dataRegis;
    }

    @Public()
    @Post('login')
    Login(@Body() props: { email: string; password: string }) {
        return this.accountService.login(props);
    }

    @Post('changePassword')
    ChangePassword(@Body() changePasswordDto: ChangePasswordDTO) {
        return this.accountService.changePassword(changePasswordDto);
    }
}
