import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "../email/email.service";
import { UserService } from "../User/user.service";
import { OptModel } from "./forgotPasswordSchema";
import { Opt } from "src/submodules/models/OptModel/Opt";
import { ResponseError } from "src/helpers/ResponseError";
import { MailDto } from "./dto/mailDto";
import { CreateOtpDto } from "./dto/create-otp";
import { CreateEmailDto } from "../email/dto/create-email";
import { MyConfigService } from "src/myConfig.service";

@Injectable()
export class OtpService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly emailService: EmailService,
    private readonly myConfigService: MyConfigService
  ) {}
  async getEmail(emailDto: MailDto) {
    const user = await this.usersService.getUserCurrent(emailDto.email);
    if (!user) {
      throw ResponseError.badInput("User not found");
    }
    const otp = new CreateOtpDto();
    otp.email = user.email;
    otp.code = this.generateOTP();
    await this.createOtp(otp);
    const email = new CreateEmailDto();
    email.to = user.email;
    const data = {
      subject: "Password Reset OTP",
      to: email.to,
      template: "./forgot-password",
      context: {
        email: email.to,
        otp: otp.code,
      },
    };
    await this.emailService.sendMailTemplate(data);
    const payload = { email: user.email };
    const expiresIn = this.myConfigService.getExpiresInForgotPassword;
    const forgotPasswordToken = this.jwtService.sign(payload, { expiresIn });
    return { forgot_password_token: forgotPasswordToken };
  }

  // handle functions
  async createOtp(createOtpDto: CreateOtpDto): Promise<any> {
    const createdOtp = await OptModel.upsert(createOtpDto);
    return createdOtp;
  }
  private generateOTP(): string {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }
  private async findOtpByEmail(email: string): Promise<Opt> {
    const otp = await OptModel.findOne({ where: { email: email } });
    if (!otp) {
      throw ResponseError.badInput("OTP not found");
    }
    return otp;
  }
}
