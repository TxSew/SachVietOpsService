import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TUser, User } from "src/submodules/models/UserModel/User";
import { UserModel } from "../Auth/auth.schema";
import { UserQueryDto } from "./dto/query-users";
import { ResponseError } from "src/helpers/ResponseError";
import { Op } from "sequelize";

@Injectable()
export class UserService {
  async getUsers(query: UserQueryDto): Promise<TUser> {
    const search = query.keyword || "";
    const limit: number = Number(query.limit) || 5;
    const page: number = Number(query.page) || 1;
    const offset = (page - 1) * limit;
    const users = await UserModel.findAll({});
    try {
      const GetUsers = await UserModel.findAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        where: {
          [Op.or]: [{ fullName: { [Op.like]: `%${search}%` } }],
        },
      });
      if (!GetUsers) {
        throw ResponseError.notFound("USer not found");
      }
      let totalPage = Math.ceil(users.length / limit);
      return {
        limit: limit,
        totalPage: totalPage,
        page: page,
        Users: GetUsers,
      };
    } catch (err) {
      throw ResponseError.badInput(err.message);
    }
  }
  async getUserCurrent(email: string): Promise<User> {
    try {
      const userCurrent = await UserModel.findOne({
        where: {
          email: email,
        },
      });
      if (!userCurrent) {
        throw ResponseError.notFound;
      }
      return userCurrent;
    } catch (err) {
      throw ResponseError.badInput("Not Found");
    }
  }
  async updateUserCurrent(id: number, userCurrent: User) {
    try {
      const UserUpdate = await UserModel.update(userCurrent, {
        where: { id: id },
      });
      if (!UserUpdate) {
        throw ResponseError.notFound("Not Found user update");
      }
      return UserUpdate;
    } catch (err) {
      throw ResponseError.badInput(`Not Found ${err}`);
    }
  }
}
