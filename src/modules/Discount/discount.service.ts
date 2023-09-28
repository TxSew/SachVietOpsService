import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Discount } from 'src/submodules/models/DiscountModel/Discount';
import { DiscountModel } from './discount.shema';

@Injectable()
export class DiscountService {
  async GetAll() {
    const discountData = await DiscountModel.findAll({});
    console.log(discountData);

    return discountData;
  }

  async createDiscount(discount: Discount) {
    const discountDto: any = discount;
    try {
      if (!discount) {
        throw 'discount creating not value';
      }
      console.log('dius', discount);

      const discountData = await DiscountModel.create(discountDto);
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
