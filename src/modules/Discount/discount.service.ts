import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Discount } from "src/submodules/models/DiscountModel/Discount";
import { DiscountModel } from "./discount.shema";
import { ResponseError } from "src/helpers/ResponseError";

@Injectable()
export class DiscountService {
  async GetAll(): Promise<Discount[]> {
    const discountData = await DiscountModel.findAll({});
    return discountData;
  }

  async createDiscount(discount: Discount): Promise<Discount> {
    try {
      if (!discount) {
        throw ResponseError.notFound("Discount not found");
      }
      const discountData = await DiscountModel.create(discount);
      return discountData;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.ACCEPTED);
    }
  }

  async updateDiscount(id: number, discount: Partial<Discount>) {
    try {
      const updated = await DiscountModel.update(discount, {
        where: { id: id },
      });
      return updated;
    } catch (errors) {
      throw new BadRequestException(errors.message);
    }
  }

  async removeDiscount(id) {
    DiscountModel.destroy({
      where: { id: id },
    });
  }
}
