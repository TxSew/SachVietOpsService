import { Body, Controller, Post } from "@nestjs/common";
import { OtpService } from "./forgot-password.service";
import { MailDto } from "./dto/mailDto";

Controller("otp");
export class OtpController {
  constructor(private readonly OtpService: OtpService) {}
  @Post("getEmail")
  async getEmail(@Body() emailDto: MailDto): Promise<any> {
    return this.OtpService.getEmail(emailDto);
  }
}
