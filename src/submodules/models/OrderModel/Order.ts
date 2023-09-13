import { BaseModel } from "../BaseModel";
import { Modified } from "../BaseModel/contanst";

export interface Order extends BaseModel , Modified {
  orderCode?: string;
  userID?: number;
  orderDate?: string;
  fullName?: string;
  phone?: string;
  money?: string;
  price_ship?: string;
  coupon?: string;
  province?: string;
  district?: string;
  address?: string;

}
 export interface orderDetail {
   productId?: number;
   orderID?: number;
    count?:number;
   price?:number;
   
 }


 export interface OrderDto {
  orders: Order;
  orderDetail: orderDetail[]
 }
// orderDto {
//   order:Order,
//   orderDetail:or[]
// }
