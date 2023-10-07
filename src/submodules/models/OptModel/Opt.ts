import { type } from "os";
import { Model } from "sequelize";

export interface Opt extends Model {
  email?: string;
  code?: string;
}
export interface CreateEmail extends Omit<Opt, "token"> {
  code?: string;
}
