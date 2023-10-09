import { Model } from "sequelize";
import { BaseModel } from "../BaseModel";
import { Modified } from "../BaseModel/constanst";

export interface User extends Modified, BaseModel, Model {
  fullName?: string;
  password?: string;
  phone?: number;
  userGroup?: number;
  email?: string;
  address?: string
};

export type LoginDto = Pick<User, "email"| "password" >
 export interface ResponseUser {
   user: Omit<User , "password"> 
   token?: string;
 }
export interface TUser {
  totalPage: number;
  page: number;
  limit: number;
  Users: User[];
}
