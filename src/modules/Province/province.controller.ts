import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { JwtAuthGuard, Public } from 'src/guard/jwtGuard';

@Controller('province')
@UseGuards(JwtAuthGuard)
export class ProvinceController {
    constructor(private provinceService: ProvinceService) {}

    @Public()
    @Get('')
    async getProvince() {
        return this.provinceService.getProvince();
    }

    @Public()
    @Get('/district')
    async getDistrict() {
        return this.provinceService.getDistrict();
    }
}
