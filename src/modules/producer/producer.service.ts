import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Producer, TProducer } from 'src/submodules/models/producerModel/producer';
import { ProducerModel } from './producer.schema';
import { ProducerQueyDto } from './dto/query-producer';
import { ResponseError } from 'src/helpers/ResponseError';
import { Op } from 'sequelize';

@Injectable()
export class ProducerService {
    async getListProducer(query): Promise<any> {
        const limited = Number(query.limit) || 6;
        const page = query.page || 1;
        const keyword = query.keyword || '';
        const offset = (Number(page) - 1) * limited;
        try {
            const data = await ProducerModel.findAll({
                where: {
                    [Op.or]: [{ name: { [Op.like]: `%${keyword}%` } }],
                },
                limit: limited,
                offset: offset,
            });
            const findAllProducer = await ProducerModel.findAll({
                where: {
                    [Op.or]: [{ name: { [Op.like]: `%${keyword}%` } }],
                },
            });
            const pageTotal = Math.ceil(findAllProducer.length / limited);
            return {
                page: page,
                totalPage: pageTotal,
                limit: limited,
                producers: data,
            };
        } catch (err) {
            throw new HttpException(err, HttpStatus.FORBIDDEN);
        }
    }
    async getProducer(id: number): Promise<Producer> {
        const producer = await ProducerModel.findOne({
            where: {
                id: id,
            },
        });
        if (!producer) throw ResponseError.badInput('producer not found');
        return producer;
    }

    async createProducer(producer: Partial<Producer>): Promise<Producer> {
        try {
            const producerData = await ProducerModel.create(producer);
            return producerData;
        } catch (err) {
            throw ResponseError.badInput('producer add fail');
        }
    }

    async update(id: number, producer: Producer) {
        const ProducerData = await ProducerModel.update(producer, {
            where: {
                id: id,
            },
        });
        return ProducerData;
    }
    async removeProducerTrashed(id: number) {
        const destroy = await ProducerModel.destroy({
            where: { id: id },
        });
        return destroy;
    }
}
