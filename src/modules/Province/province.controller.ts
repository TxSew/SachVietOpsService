import { Controller, Get } from '@nestjs/common';
import { ProvinceService } from './province.service';

@Controller('province')
export class ProvinceController {
  constructor(private provinceService: ProvinceService) {}
  @Get('')
  async getProvince() {
    return this.provinceService.getProvince();
  }
  @Get('/district')
  async getDistrict() {
    return this.provinceService.getDistrict();
  }
}
