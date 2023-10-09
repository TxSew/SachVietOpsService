import { MailerService } from "@nestjs-modules/mailer";
import { Body, Controller, Param, Post, Put, Query, Res } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { User } from "src/submodules/models/UserModel/User";
import { AccountService } from "./auth.service";
import { LoginRequestDTO } from "./dto/loginRequest.dto";
import { ChangePasswordDTO } from "./dto/changePassword.dto";
import { RefreshDTO } from "./dto/refresh.dto";
@ApiTags("Auth")
@Controller("auth")
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private mailerService: MailerService
  ) {}
  // register user
  // @UseGuards(JwtAuthGuard)
  @Post("register")
  @ApiOperation({ summary: "Create a new account" })
  @ApiCreatedResponse({ description: "The cat has been successfully created." })
  async create(@Body() register: User): Promise<User> {
    return this.accountService.register(register);
  }
  // login User
  @Post("Login")
  @ApiOperation({ summary: "check login account" })
  @ApiCreatedResponse({ description: " checkLogin successfully." })
  async Login(
    @Body() loginDto: LoginRequestDTO,
  ) {
    return this.accountService.checkLogin(loginDto );
  }
  @Put("changePassword")
  async ChangePassword(@Body() changePasswordDto: ChangePasswordDTO) {
    return this.accountService.changePassword(changePasswordDto);
  }
}
