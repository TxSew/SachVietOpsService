import { Body, Controller, Post } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { MailDto } from "./dto/mailDto";
import { forgetPasswordService } from "./forgot-password.service";

@Controller("forgetPassword")
export class ForgetPasswordController {
  constructor(private forgetPassword: forgetPasswordService) {}
  @Post("forgot-password")
  @ApiResponse({
    status: 200,
  })
  async getEmail(@Body() mailDto: MailDto) {}
}
