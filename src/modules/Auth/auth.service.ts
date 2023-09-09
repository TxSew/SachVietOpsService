import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/submodules/models/UserModel/User';
import {  Models, UserModel } from './auth.schema';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { LoginRequestDTO } from './dto/loginRequest.dto';

@Injectable()
export class CustomerService {
  async getAll(): Promise<Models[]> {
    const data = await UserModel.findAll({});
    return data;
  }

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
  async checkLogin(loginRequestDTO: LoginRequestDTO){
     const user = await  this.validateUser(loginRequestDTO) 
    return ;
  }

  private async validateUser(loginRequestDTO: LoginRequestDTO) {
    const user = await UserModel.findOne({
       where: { email: loginRequestDTO.email}
    })

    if (!user) {
      throw new NotFoundException('User not found. Invalid email.');
    }

    const isPasswordValid = await  bcrypt.compare(loginRequestDTO.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password.');
    }


    return user;
  }
  async changePassword(changePasswordDTO: ChangePasswordDTO) {
    const { id, password, newPassword, repeatNewPassword } = changePasswordDTO;
    return { message: 'Password changed successfully.' };
  }
}
