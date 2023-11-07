import { Model } from 'sequelize';
import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/constanst';

export interface Discount extends BaseModel, Modified, Model {
    code?: string;
    discount?: string;
    limit_number?: number;
    number_used?: number;
    expiration_date?: string;
    payment_limit?: number;
    desc?: string;
}
