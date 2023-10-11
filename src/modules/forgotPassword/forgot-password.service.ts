import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ResponseError } from "src/helpers/ResponseError";
import { MyConfigService } from "src/myConfig.service";
import { EmailDto, Otp } from "src/submodules/models/OptModel/Opt";
import { UserService } from "../User/user.service";
import { CreateEmailDto } from "../email/dto/create-email";
import { EmailService } from "../email/email.service";
import { CreateOtpDto } from "./dto/create-otp";
import { NewPasswordDTO } from "./dto/newPasswordDto";
import { OptModel } from "./forgotPasswordSchema";

@Injectable()
export class OtpService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly emailService: EmailService,
    private readonly myConfigService: MyConfigService
  ) {}
  async getEmail(emailDto: Partial<EmailDto>): Promise<any> {
    console.log("email", emailDto);
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
    // const expiresIn = this.myConfigService.getExpiresInForgotPassword;
    // const expiresIn: string = process.env.JWT_ExpiresIn;
    const forgotPasswordToken = await this.jwtService.sign(payload, {
      secret: "forgotPassword",
      expiresIn: "1d",
    });
    // const forgotPasswordToken = this.jwtService.sign(payload);
    return { forgot_password_token: forgotPasswordToken };
  }
  async verifyOtp(
    otp: number,
    token: string
  ): Promise<{ reset_password_token: string }> {
    try {
      if (!token) {
        throw ResponseError.badInput("Token not found");
      }
      const decoded = await this.jwtService.verify(token, {
        secret: "forgotPassword",
      });
      const user = await this.usersService.getUserCurrent(decoded.email);
      if (!user) {
        throw ResponseError.notFound("User not found");
      }
      const otpItem = await this.findOtpByEmail(user.email);
      if (otp !== Number(otpItem.code)) {
        throw ResponseError.conflict("Invalid OTP Code");
      }
      await this.removeOtpByEmail(user.email);
      const payload = { email: user.email };
      const resetPasswordToken = this.jwtService.sign(payload, {
        secret: "resetPasswordToken",
        expiresIn: "1d",
      });

      return { reset_password_token: resetPasswordToken };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw ResponseError.unauthorized(
          "Token has expired, please get a new token"
        );
      }
      console.log(error);
      throw error;
    }
  }
  async resetPassword(
    token: string,
    newPasswordDTO: NewPasswordDTO
  ): Promise<{ message: string }> {
    try {
      if (!token) {
        throw ResponseError.unauthenticated("Invalid token");
      }
      const decoded = this.jwtService.verify(token, {
        secret: "resetPasswordToken",
      });
      const user = await this.usersService.getUserCurrent(decoded.email);
      if (!user) {
        throw ResponseError.badInput("Invalid token");
      }
      if (newPasswordDTO.newPassword !== newPasswordDTO.repeatNewPassword) {
        throw ResponseError.conflict("Passwords do not match");
      }
      this.usersService.updateNewPassword(user.id, newPasswordDTO.newPassword);
      return { message: "Password reset successful" };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedException(
          "Token has expired, please get a new token"
        );
      }
      throw error;
    }
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
  private async findOtpByEmail(email: string): Promise<Otp> {
    const otp = await OptModel.findOne({ where: { email: email } });
    if (!otp) {
      throw ResponseError.badInput("OTP not found");
    }
    return otp;
  }
  private async removeOtpByEmail(email: string): Promise<void> {
    await OptModel.destroy({ where: { email: email } });
  }
}
