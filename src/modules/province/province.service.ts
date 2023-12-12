import { Injectable } from '@nestjs/common';
import { DistrictModel } from './dto/district.schema';
import { ProvinceModel } from './dto/province.schema';

Injectable();
export class ProvinceService {
    async getProvince() {
        const province = await ProvinceModel.findAll({
            include: [
                {
                    model: DistrictModel,
                    as: 'district',
                },
            ],
        });
        return province;
    }
    async getDistrict() {
        const district = await DistrictModel.findAll({});
        return district;
    }
}
