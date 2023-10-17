import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Discount } from "src/submodules/models/DiscountModel/Discount";
import {
  Order,
  OrderDto,
  TOrderResponse,
  TOrders,
} from "src/submodules/models/OrderModel/Order";
import { UserModel } from "../Auth/auth.schema";
import { DiscountModel } from "../Discount/discount.shema";
import { ProductModel } from "../Product/product.schema";
import { OrderDetailModel } from "./dto/orderDetail.schema";
import { OrderQueryDto } from "./dto/query-orders";
import { OrderModel } from "./order.schema";

@Injectable()
export class OrderService {
  async getOrderAll(query: OrderQueryDto): Promise<TOrders> {
    const limit = query.limit || 6;
    const page = query.page || 1;
    const limited = Number(limit);
    const offset = (Number(page) - 1) * limited;
    const searchQuery = query.keyword || "";
    const orders = await OrderModel.findAll({});
    try {
      const listOrder: Order[] = await OrderModel.findAll({
        limit: limited,
        offset,
        include: [
          {
            model: UserModel,
            as: "users",
          },
        ],
      });
      const totalPage = Math.round((await orders.length) / limited);
      return {
        totalPage: totalPage,
        limit: limited,
        page: page,
        orders: listOrder,
      };
    } catch (error) {
      throw "errors: " + error;
    }
  }
  async createOrder(orderDto: Partial<OrderDto>): Promise<TOrderResponse> {
    // var accessKey = "F8BBA842ECF85";
    // var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    // var orderInfo = "pay with MoMo";
    // var partnerCode = "MOMO";
    // var redirectUrl =
    //   "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    // var ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    // var requestType = "payWithMethod";
    // var amount = "2000";
    // var orderId = partnerCode + new Date().getTime();
    // var requestId = orderId;
    // var extraData = "";
    // var paymentCode =
    //   "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
    // var orderGroupId = "";
    // var autoCapture = true;
    // var lang = "vi";

    // //before sign HMAC SHA256 with format
    // //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    // var rawSignature =
    //   "accessKey=" +
    //   accessKey +
    //   "&amount=" +
    //   amount +
    //   "&extraData=" +
    //   extraData +
    //   "&ipnUrl=" +
    //   ipnUrl +
    //   "&orderId=" +
    //   orderId +
    //   "&orderInfo=" +
    //   orderInfo +
    //   "&partnerCode=" +
    //   partnerCode +
    //   "&redirectUrl=" +
    //   redirectUrl +
    //   "&requestId=" +
    //   requestId +
    //   "&requestType=" +
    //   requestType;
    // //puts raw signature
    // console.log("--------------------RAW SIGNATURE----------------");
    // console.log(rawSignature);
    // //signature
    // const crypto = require("crypto");
    // var signature = crypto
    //   .createHmac("sha256", secretKey)
    //   .update(rawSignature)
    //   .digest("hex");
    // console.log("--------------------SIGNATURE----------------");
    // console.log(signature);

    // //json object send to MoMo endpoint
    // const requestBody = JSON.stringify({
    //   partnerCode: partnerCode,
    //   partnerName: "Test",
    //   storeId: "MomoTestStore",
    //   requestId: requestId,
    //   amount: amount,
    //   orderId: orderId,
    //   orderInfo: orderInfo,
    //   redirectUrl: redirectUrl,
    //   ipnUrl: ipnUrl,
    //   lang: lang,
    //   requestType: requestType,
    //   autoCapture: autoCapture,
    //   extraData: extraData,
    //   orderGroupId: orderGroupId,
    //   signature: signature,
    // });
    // //Create the HTTPS objects
    // const https = require("https");
    // const options = {
    //   hostname: "test-payment.momo.vn",
    //   port: 443,
    //   path: "/v2/gateway/api/create",
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Content-Length": Buffer.byteLength(requestBody),
    //   },
    // };
    // //Send the request and get the response
    // const req = await https.request(options, (res) => {
    //   console.log(`Status: ${res.statusCode}`);
    //   console.log(`Headers: ${JSON.stringify(res.headers)}`);
    //   res.setEncoding("utf8");
    //   res.on("data", (body) => {
    //     console.log("Body: ");
    //     console.log(body);
    //     console.log("resultCode: ");
    //     console.log(JSON.parse(body).resultCode);
    //   });
    //   res.on("end", () => {
    //     console.log("No more data in response.");
    //   });
    // });

    // req.on("error", (e) => {
    //   console.log(`problem with request: ${e.message}`);
    // });
    // // write data to request body
    // console.log("Sending....");
    // req.write(requestBody);
    // req.end();

    const resultOrder: any = orderDto.orders;
    const dataDetail: any[] = orderDto.orderDetail;
    let coupon: number = 0;

    if (resultOrder?.orderCode) {
      const discount: Discount = await DiscountModel.findOne({
        where: { code: resultOrder?.orderCode },
      });
      if (!discount) {
        throw new HttpException("discount not found", HttpStatus.FORBIDDEN);
      }
      if (discount?.number_used >= discount.limit_number) {
        throw new HttpException("discount limited value", HttpStatus.FORBIDDEN);
      }
      if (resultOrder.money < discount.payment_limit) {
        throw new HttpException(
          "discount  maximum value",
          HttpStatus.FORBIDDEN
        );
      }
      coupon = Number(discount.discount);
    }
    resultOrder.coupon = coupon;
    try {
      const priceTotal = dataDetail.reduce(
        (total, current) => total + current.price * current.quantity,
        0
      );
      resultOrder.money = priceTotal;
      // resultOrder.price_ship = resultOrder.money - resultOrder.coupon;
      let results = await OrderModel.create(resultOrder).then(async (res) => {
        let id = await res.get().id;
        dataDetail.map((dataDetail) => {
          return (dataDetail.orderID = id);
        });
        const detailData = await OrderDetailModel.bulkCreate(dataDetail);
        return { result: res, detailData };
      });
      return results;
    } catch (err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN);
    }
  }

  async getOrderDetailByOrder(id: number): Promise<any> {
    const detailedOrder = await OrderModel.findAll({
      include: [
        {
          model: OrderDetailModel,
          as: "orderDetail",
          include: [
            {
              model: ProductModel,
              as: "product",
            },
          ],
        },
      ],
      where: {
        id: id,
      },
    });
    return detailedOrder[0];
  }
  //  get order by current
  async getOrderByCurrent(id: number): Promise<OrderDto[]> {
    const orderCurrent = await OrderModel.findAll({});
    return orderCurrent;
  }
  // remove order
  async RemoveOrder(id: number) {
    console.log(id);
    const destroyOrder = await OrderModel.destroy({
      where: { id: Number(id) },
    });
    return destroyOrder;
  }
  async update(id: number, status: any) {
    OrderModel.update(
      { status: status.status },
      {
        where: {
          id: Number(id),
        },
      }
    );
  }
}