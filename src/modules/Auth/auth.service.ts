import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { appConfig } from "src/constants/IConfig";
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
  async register(account: Partial<User>): Promise<User> {

    const existingUser = await UserModel.findOne({
      where: { email: account.email },
    });
    if (existingUser) {
        throw ResponseError.badInput('email already exists');
        }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(account.password, saltOrRounds);
    account.password = await hash;

    const register = await UserModel.create(account);
    return register;
  }

  async login(loginRequestDTO: LoginDto) {
    const user = await this.validateUser(loginRequestDTO);
    try {
           const sign = this.jwtService.sign({Id:user.get().id}, {
        secret:appConfig.jwt.secret
      })

      const { password, ...rest } =  user.dataValues;

      return { user: rest, token: sign };
    } catch (err) {
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
