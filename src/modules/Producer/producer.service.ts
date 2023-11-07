import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Producer, TProducer } from 'src/submodules/models/producerModel/producer';
import { ProducerModel } from './producer.schema';
import { ProducerQueyDto } from './dto/query-producer';
import { ResponseError } from 'src/helpers/ResponseError';

@Injectable()
export class ProducerService {
    async getAll(query: ProducerQueyDto): Promise<TProducer> {
        const limited = Number(query.limit) || 2;
        const page = query.page || 1;
        const offset = (Number(page) - 1) * limited;
        const findAllProducer = await ProducerModel.findAll({});
        try {
            const data = await ProducerModel.findAll({
                limit: limited,
                offset: offset,
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
    async getOne(id: number): Promise<Producer> {
        const producer = await ProducerModel.findOne({
            where: {
                id: id,
            },
        });
        if (!producer) throw ResponseError.badInput('producer not found');
        return producer;
    }

    async create(producer: Partial<Producer>): Promise<Producer> {
        const producerData = await ProducerModel.create(producer);
        return producerData;
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
