import { Model } from 'sequelize';
import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/constanst';

export interface Comment extends BaseModel, Modified, Model {
    userId: number;
    productId: number;
    image: string;
    content: string;
    star: number;
}
