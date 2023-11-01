import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailDto } from 'src/submodules/models/OptModel/Opt';
import { NewPasswordDTO } from './dto/newPasswordDto';
import { OtpCodeDto } from './dto/otpCodeDto';
import { OtpService } from './forgot-password.service';
import { Public } from 'src/guard/jwtGuard';

@ApiTags('forgot-password')
@Controller('forgotPassword')
export class OtpController {
    constructor(private readonly OtpService: OtpService) {}

    @Public()
    @Post('')
    async sendEmailOtp(@Body() emailDto: Partial<EmailDto>): Promise<unknown> {
        return this.OtpService.sendEMailOtp(emailDto);
    }

    @Post('/verify/:token')
    @ApiResponse({
        status: 200,
    })
    verifyOtp(@Body() otpCodeDto: OtpCodeDto, @Param('token') token: string): Promise<any> {
        return this.OtpService.verifyOtp(Number(otpCodeDto.otp), token);
    }

    @Post('/resetPassword/:token')
    resetPassword(@Param('token') token: string, @Body() newPasswordDTO: NewPasswordDTO) {
        return this.OtpService.resetPassword(token, newPasswordDTO);
    }
}
