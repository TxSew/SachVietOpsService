import { Injectable, Param } from '@nestjs/common';
import { CustomerModel, Models } from './auth.schema';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { User } from 'src/submodules/models/UserModel/User';

@Injectable()
export class CustomerService {
  async getAll(): Promise<Models[]> {
    const data = await CustomerModel.findAll({});
    return data;
  }

  async register(account: Partial<User>): Promise<User> {
    const existingUser = await CustomerModel.findOne({
      where: { email: account.email },
    });
    if (existingUser) {
      throw 'Email already exists';
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(account.password, saltOrRounds);
    account.password = await hash;
    const register = await CustomerModel.create(account);

    return register;
  }
  async checkLogin(account: Partial<User>): Promise<User> {
    return;
  }

  async changePassword(changePasswordDTO: ChangePasswordDTO) {
    const { id, password, newPassword, repeatNewPassword } = changePasswordDTO;
    return { message: 'Password changed successfully.' };
  }
}
