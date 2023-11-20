import { Injectable } from '@nestjs/common';
import { ProvinceModel } from './dto/province.schema';
import { Model } from 'sequelize';
import { DistrictModel } from './dto/district.schema';

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
