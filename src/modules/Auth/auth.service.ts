import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Response } from 'express';
import { User } from 'src/submodules/models/UserModel/User';
import { UserModel } from './auth.schema';
import { LoginRequestDTO } from './dto/loginRequest.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AccountService {
  constructor(
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}
  // register
  async register(account: Partial<User>): Promise<User> {
    const existingUser = await UserModel.findOne({
      where: { email: account.email },
    });
    if (existingUser) {
      throw new HttpException(
        {
          message: 'Email already exists',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(account.password, saltOrRounds);
    account.password = await hash;
    // const payload = {
    //   subject: 'welcome email notification',
    //   to: account.email,
    //   template: './welcome',
    //   context: {
    //     email: account.email,
    //   },
    // };
    const register = await UserModel.create(account);
    if (register) {
      const payload = {
        subject: 'welcome email notification',
        to: account.email,
        template: './welcome',
        context: {
          email: account.email,
        },
      };
      this.emailService.sendMailTemplate(payload);
    }
    return register;
  }
  async checkLogin(loginRequestDTO: LoginRequestDTO, response: Response) {
    //validate login request
    console.log(loginRequestDTO);

    const user = await this.validateUser(loginRequestDTO);
    try {
      // create access token  sign
      const payload = await { email: user.email, role: user.userGroup };
      const expiresIn: string = process.env.JWT_ExpiresIn;
      const sign = this.jwtService.sign(payload, {
        secret: expiresIn,
        expiresIn: '1d',
      });
      //return data
      const { password, ...rest } = await user.dataValues;
      // if (rest.userGroup == 0) {
      //   return { user: rest, token: sign };
      // }
      // if (rest.userGroup == 2) {
      //   return { user: rest, token: sign };
      // }
      return { user: rest, token: sign };
    } catch (err) {
      throw new HttpException('error', HttpStatus.FORBIDDEN);
    }
  }

  private async validateUser(loginRequestDTO: LoginRequestDTO) {
    const user = await UserModel.findOne({
      where: { email: loginRequestDTO.email },
    });
    if (!user) {
      throw new HttpException('invalid email', HttpStatus.FORBIDDEN);
    }
    const isPasswordValid = await bcrypt.compare(
      loginRequestDTO.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password.');
    }
    return user;
  }

  async changePassword(id: number, password: string) {
    return;
  }
}
