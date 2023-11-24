import { Model } from 'sequelize';
import { BaseModel } from '../BaseModel';
import { Modified } from '../BaseModel/constanst';
import { Product } from '../ProductModel/Product';

export interface Order extends BaseModel, Modified, Model {
    orderCode?: string;
    userID?: number;
    orderDate?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    money?: string;
    price_ship?: string;
    coupon?: string;
    province?: string;
    district?: string;
    address?: string;
    orderDetail?: OrderDetail[];
}
export interface TOrderResponse {
    result: Order;
    detailData: OrderDetail[];
}
export interface TOrders {
    totalPage?: number;
    pageSize?: number;
    page?: number;
    limit?: number;
    orders?: Order[];
}

export interface OrderDetail extends Modified {
    productName?: string;
    productId?: number;
    orderID?: number;
    quantity?: number;
    image?: string;
    price?: number;
    product?: Product[];
}

export interface OrderDto {
    orders?: Order;
    orderDetail?: OrderDetail[];
    paymentMethod?: string;
}
