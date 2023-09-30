import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/submodules/models/UserModel/User';
import { UserModel } from '../Auth/auth.schema';
import { UserQueryDto } from './dto/query-users';
import { ResponseError } from 'src/helpers/ResponseError';

@Injectable()
export class UserService {
  async getUsers(query: UserQueryDto): Promise<User[]> {
    const limit = query.limit || 5;
    const page = query.page || 1;
    const offset = (page - 1) * limit;
    try {
      const GetUsers = await UserModel.findAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });
      if (!GetUsers) {
        throw ResponseError.notFound('USer not found');
      }
      return GetUsers;
    } catch (err) {
      throw ResponseError.badInput;
    }
  }
  async getUserCurrent(id: number): Promise<User> {
    try {
      const userCurrent = await UserModel.findOne({
        where: { id: id },
      });
      if (!userCurrent) {
        throw ResponseError.notFound;
      }
      return userCurrent;
    } catch (err) {
      throw ResponseError.badInput('Not Found');
    }
  }
  async updateUserCurrent(id: number, userCurrent: User): Promise<any> {
    try {
      const UserUpdate = await UserModel.update(userCurrent, {
        where: { id: id },
      });
      if (!UserUpdate) {
        throw ResponseError.notFound('Not Found user update');
      }
      return UserUpdate;
    } catch (err) {
      throw ResponseError.badInput(`Not Found ${err}`);
    }
  }
}
