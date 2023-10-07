import { type } from "os";
import { Model } from "sequelize";

export interface Opt extends Model {
  email?: string;
  token?: string;
}
export interface CreateEmail extends Omit<Opt, "token"> {
  code?: string;
}
