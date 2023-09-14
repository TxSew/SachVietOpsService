import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Request, Response } from 'express';
import { User } from 'src/submodules/models/UserModel/User';
import { Models, UserModel } from './auth.schema';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { LoginRequestDTO } from './dto/loginRequest.dto';

@Injectable()
export class AccountService {
  constructor(private jwtService: JwtService) {}
    // register
    async register(account: Partial<User>): Promise<User> {
    const existingUser = await UserModel.findOne({
      where: { email: account.email },
    });
    if (existingUser) {
      throw 'Email already exists';
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(account.password, saltOrRounds);
    account.password = await hash;
    const register = await UserModel.create(account);
    return register;
  }
  async checkLogin(loginRequestDTO: LoginRequestDTO, response: Response) {
    //validate login request
     try {
     const user = await this.validateUser(loginRequestDTO);
    // create access token  sign
    const payload = { email: user.email, role: user.userGroup };
    const expiresIn: string =  process.env.JWT_ExpiresIn;
    const sign = this.jwtService.sign(payload, {
      secret: expiresIn,
      expiresIn: "20000"
    });
    const cookie = await response.cookie('jwt', sign, { httpOnly: true });
    //return data
    const { password, ...rest } = await user.dataValues;
    // if (rest.userGroup == 0) {
    //   return { user: rest, token: sign };
    // }
    // if (rest.userGroup == 2) {
    //   return { user: rest, token: sign };
    // }
    return { user: rest , token:sign };  
     }
      catch(err) {
         throw new HttpException(err, HttpStatus.FORBIDDEN)
      }
    
  }

  private async validateUser(loginRequestDTO: LoginRequestDTO) {
    const user = await UserModel.findOne({
      where: { email: loginRequestDTO.email },
    });
    if (!user) {
      throw new NotFoundException('User not found. Invalid email.');
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
 
  async changePassword(id:number, password:string) {
     return
  }
}
