import { Model } from 'sequelize';
import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/constanst';

export interface Comment extends BaseModel, Modified, Model {
    images: string;
    content: string;
}
