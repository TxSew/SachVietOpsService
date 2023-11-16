import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/guard/jwtGuard';
import { EmailDto } from 'src/submodules/models/OptModel/Opt';
import { OtpService } from './forgot-password.service';

@ApiTags('forgot-password')
@Controller('forgotPassword')
export class OtpController {
    constructor(private readonly OtpService: OtpService) {}

    @Public()
    @Post('send-otp-email')
    async sendEmailOtp(@Body() emailDto: EmailDto) {
        return this.OtpService.sendEMailOtp(emailDto);
    }

    @Public()
    @Post('verify-otp-email-resetPassword')
    @ApiResponse({
        status: 200,
    })
    verifyOtpAndResetPassword(@Body() props: { email: string; otp: string; token: string; password: string }) {
        return this.OtpService.verifyOtpAndResetPassword(props);
    }
}
