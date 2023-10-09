import { BaseModel } from "../BaseModel";
import { Modified } from "../BaseModel/constanst";

export interface UserGroup extends BaseModel, Modified {
  name?: string;
}
