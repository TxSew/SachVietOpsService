import { Model } from 'sequelize';
import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/constanst';

export interface Product extends BaseModel, Model, Modified {
    title?: string;
    desc?: string;
    producerID?: number;
    categoryId?: number;
    slug?: string;
    price?: number;
    image?: string;
    size?: number;
    pageNumber?: number;
    author?: string;
    price_sale?: number;
    listImage?: string;
    quantity?: number;
    productId?: number;
    sale?: number | string;
}
export interface TProduct {
    product?: Product;
    productImages?: ProductImages[];
}
export interface ProductImages extends Modified, Model {
    productId?: number;
    image?: string;
}
export interface TProductResponse {
    pageSize?: number;
    page?: number;
    limit?: number;
    totalPage?: number;
    products?: Product[];
}
