import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import * as querystring from "qs";

@Injectable()
export class PaymentService {
  async getPayment(req, res) {
    var secretKey = "ASAZCZRVEMPDKCOLJASLKTXOBDFSYPQL";
    var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = "XZLTU27D";
    vnp_Params["vnp_Merchant"] = "dwop";
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = "123333";
    vnp_Params["vnp_OrderInfo"] = "cin chao cac ban";
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = 1000 * 100;
    vnp_Params["vnp_ReturnUrl"] = "http://loalhost:3000";
    vnp_Params["vnp_IpAddr"] = "13.160.92.202";
    vnp_Params["vnp_CreateDate"] = "20230829103111";
    vnp_Params["vnp_BankCode"] = "BIDV";
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
