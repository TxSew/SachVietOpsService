import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { ResponseError } from "src/helpers/ResponseError";
import {
  LoginDto,
  User,
  userGroup,
} from "src/submodules/models/UserModel/User";
import { UserModel } from "./auth.schema";
import { ChangePasswordDTO } from "./dto/changePassword.dto";

@Injectable()
export class AccountService {
  constructor(private jwtService: JwtService) {}
  // register
  async register(account: Partial<User>): Promise<User> {
    const existingUser = await UserModel.findOne({
      where: { email: account.email },
    });
    if (existingUser) {
      throw new HttpException(
        {
          message: "Email already exists",
        },
        HttpStatus.FORBIDDEN
      );
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(account.password, saltOrRounds);
    account.password = await hash;
    const register = await UserModel.create(account);
    return register;
  }
  async checkLogin(loginRequestDTO: LoginDto) {
    //validate login request
    const user = await this.validateUser(loginRequestDTO);
    try {
      const payload = {
        email: user.get().email,
        role: user.get().userGroup,
      };

      const sign = await this.accessToken(payload);

      const { password, ...rest } = await user.dataValues;

      if (rest.userGroup == userGroup.user) {
        return { user: rest };
      }
      if (rest.userGroup == userGroup.admin) {
        return { user: rest, token: sign };
      }
    } catch (err) {
      throw new HttpException("error", HttpStatus.FORBIDDEN);
    }
  }
  async accessToken(payload) {
    const expiresIn: string = process.env.JWT_ExpiresIn;
    const sign = this.jwtService.sign(payload, {
      secret: expiresIn,
      expiresIn: "1d",
    });
    return sign;
  }

  async changePassword(changeRequestDTO: ChangePasswordDTO) {
    const { userId, password, newPassword, repeatNewPassword } =
      changeRequestDTO;

    const User = await UserModel.findOne({
      where: { id: userId },
    });

    if (!User) {
      throw new HttpException("not found user", HttpStatus.FORBIDDEN);
    } else {
      const isCheckPassword = await bcrypt.compare(
        password,
        User.get().password
      );
      if (isCheckPassword) {
        const isCheck = this.validatePasswordChange(
          newPassword,
          repeatNewPassword
        );
        if (isCheck) {
          const saltOrRounds = 10;
          const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);
          await UserModel.update(
            { password: hashedPassword },
            {
              where: { id: User.get().id },
            }
          );
          return { password: "Password changed successfully" };
        }
      } else {
        throw ResponseError.badInput("password is incorrect");
      }
    }
  }

  private validatePasswordChange(newPassword, repeatNewPassword) {
    if (newPassword !== repeatNewPassword) {
      throw new BadRequestException("Passwords do not match.");
    }
    return true;
  }

  private async validateUser(loginRequestDTO: LoginDto) {
    const user = await UserModel.findOne({
      where: { email: loginRequestDTO.email },
    });
    if (!user) {
      throw new HttpException("invalid email", HttpStatus.FORBIDDEN);
    }
    console.log(user.get().password);
    const isPasswordValid = await bcrypt.compare(
      loginRequestDTO.password,
      user.get().password
    );
    if (!isPasswordValid) {
      throw new BadRequestException("Invalid password.");
    }
    return user;
  }
}
