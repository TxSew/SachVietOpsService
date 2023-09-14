import { Controller } from "@nestjs/common";
import { DiscountService } from "./discount.service";

 

 @Controller('discount')
  export class DiscountController {
     constructor(private discountService: DiscountService){}
     async getDiscount() {
         return this.discountService.GetAll()
     } 
  }