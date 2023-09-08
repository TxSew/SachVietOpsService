import { Injectable, Param } from '@nestjs/common';
import { CustomerModel, Models } from './auth.schema';
import { Customer } from 'src/submodules/models/CustomerModel/Customer';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO } from './dto/changePassword.dto';

@Injectable()
export class CustomerService {
  async getAll(): Promise<Models[]> {
    const data = await CustomerModel.findAll({});
    return data;
  }

  async register(account: Partial<Customer>): Promise<Customer> {
    const existingUser = await CustomerModel.findOne({
      where: { email: account.email },
    });

    if (existingUser) {
      throw 'Email already exists';
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(account.password, saltOrRounds);
    account.password = await hash;

    return CustomerModel.create(account);
  }
  async checkLogin(account: Partial<Customer>): Promise<Customer> {
    return;
  }
  async changePassword(changePasswordDTO: ChangePasswordDTO) {
    const { id, password, newPassword, repeatNewPassword } = changePasswordDTO;
    return { message: 'Password changed successfully.' };
  }
}
