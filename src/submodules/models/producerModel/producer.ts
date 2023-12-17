import { Model } from 'sequelize';
import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/constanst';

export interface Producer extends BaseModel, Modified, Model {
    name?: string;
    code?: string;
    slug?: string;
    keyword?: string;
}
export interface TProducer {
    totalPage?: number;
    limit?: number;
    page?: number;
    producers?: Producer[];
}
