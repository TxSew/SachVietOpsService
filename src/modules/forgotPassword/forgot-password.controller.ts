import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { EmailDto } from "src/submodules/models/OptModel/Opt";
import { NewPasswordDTO } from "./dto/newPasswordDto";
import { OtpCodeDto } from "./dto/otpCodeDto";
import { OtpService } from "./forgot-password.service";

@ApiTags("forgot-password")
@Controller("forgotPassword")
export class OtpController {
  constructor(private readonly OtpService: OtpService) {}
  @Post("")
  async getEmail(@Body() emailDto: Partial<EmailDto>): Promise<unknown> {
    return this.OtpService.getEmail(emailDto);
  }
  @Post("/verify/:token")
  @ApiResponse({
    status: 200,
  })
  async verifyOtp(
    @Body() otpCodeDto: OtpCodeDto,
    @Param("token") token: string
  ): Promise<any> {
    return this.OtpService.verifyOtp(Number(otpCodeDto.otp), token);
  }
  @Post("/resetPassword/:token")
  async resetPassword(
    @Param("token") token: string,
    @Body() newPasswordDTO: NewPasswordDTO
  ) {
    return this.OtpService.resetPassword(token, newPasswordDTO);
  }
}
