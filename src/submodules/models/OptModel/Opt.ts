import { type } from 'os';
import { Model } from 'sequelize';
import { Nullable } from '../BaseModel/constanst';

export interface Otp extends Model {
    email?: string;
    code?: string;
    token?: string;
}
//make a type multiple
export type EmailDto = Nullable<Omit<Otp, 'code'>>;
