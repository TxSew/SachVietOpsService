import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import * as moment from 'moment';
import * as querystring from "qs";

@Injectable()
export class PaymentService {
  async getPayment(req, res) {
    var secretKey = "ASAZCZRVEMPDKCOLJASLKTXOBDFSYPQL";
    var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    var vnp_Params = {};
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const now = moment();
    let date = await new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
     console.log(createDate);
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = "XZLTU27D";
    vnp_Params["vnp_Merchant"] = "dwop";
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = "5";
    vnp_Params["vnp_OrderInfo"] = "Thanh+toan+don+hang+%3A5";
    vnp_Params["vnp_OrderType"] = "topup";
    vnp_Params["vnp_Amount"] ="10000";
    vnp_Params["vnp_ReturnUrl"] = "https%3A%2F%2Fdomainmerchant.vn%2FReturnUrl"
    vnp_Params["vnp_IpAddr"] = "127.0.0.1";
    vnp_Params["vnp_CreateDate"] = createDate;
     
    vnp_Params = this.sortObject(vnp_Params);
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    res.json(vnpUrl);
    // Vui lòng tham khảo thêm tại code demo
  }
  async sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }
}
