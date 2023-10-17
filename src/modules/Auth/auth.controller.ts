import { Body, Controller, Post, Put } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "src/submodules/models/UserModel/User";
import { EmailService } from "../email/email.service";
import { AccountService } from "./auth.service";
import { ChangePasswordDTO } from "./dto/changePassword.dto";
import { LoginRequestDTO } from "./dto/loginRequest.dto";
@ApiTags("Auth")
@Controller("auth")
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private emailService: EmailService,
  ) {}
  // register user
  // @UseGuards(JwtAuthGuard)
  @Post("register")
  @ApiOperation({ summary: "Create a new account" })
  @ApiCreatedResponse({ description: "The cat has been successfully created." })
  async create(@Body() register: User): Promise<User> {
    const dataRegis = await this.accountService.register(register);
    await this.emailService.sendMailTemplate({
      subject: "welcome email notification",
      to: dataRegis.email,
      template: "./welcome",
      context: {
        email: register.email,
      },
    });
    return dataRegis;
  }
  // login User
  @Post("Login")
  @ApiOperation({ summary: "check login account" })
  @ApiCreatedResponse({ description: " checkLogin successfully." })
  async Login(@Body() loginDto: LoginRequestDTO) {
    return this.accountService.checkLogin(loginDto);
  }
  @Put("changePassword")
  async ChangePassword(@Body() changePasswordDto: ChangePasswordDTO) {
    return this.accountService.changePassword(changePasswordDto);
  }
}
