import { Model } from 'sequelize';
import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/constanst';

export interface New extends BaseModel, Model, Modified {
    title: string;
    slug: string;
    image: string;
    desc: string;
    author?: string;
}
