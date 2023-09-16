import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/submodules/models/UserModel/User';
import { UserModel } from '../Auth/auth.schema';
import { UserQueryDto } from './dto/query-users';

@Injectable()
export class UserService {
  async getUsers(query: UserQueryDto): Promise<User[]> {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const offset = (page - 1) * limit;
    const findOptions: any = {
      limit,
      offset,
      order: [['createdAt', 'DESC']], // Sorting by purchasedDate in descending order
    };
    try {
      const GetUsers = await UserModel.findAll(findOptions);
      if (!GetUsers) {
       throw new HttpException('User not found', HttpStatus.FORBIDDEN);
      }
      return GetUsers;
    } catch (err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN);
    }
  }
   async getUserCurrent(id:number): Promise<User> {
     try {
     const userCurrent = await UserModel.findOne({
       where: { id: id }
     })  
      if(!userCurrent) {
        throw new HttpException('User not found', HttpStatus.FORBIDDEN);
      }
        return userCurrent
     }
      catch(err) {
        throw new HttpException(err, HttpStatus.FORBIDDEN)
      }
   }
   async updateUserCurrent(id:number, userCurrent: User): Promise<any> {
     try {
     const UserUpdate = await UserModel.update(userCurrent, {
       where: { id: id}
     })
      if(!UserUpdate) {
         throw new HttpException("User updated false", HttpStatus.FORBIDDEN);
      }
       return UserUpdate
     }
      catch(err) {
         throw new HttpException(err, HttpStatus.FORBIDDEN) 
      }
   }
}
