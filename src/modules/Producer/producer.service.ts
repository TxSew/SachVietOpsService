import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Producer } from 'src/submodules/models/producerModel/producer';
import { ProducerModel, ProducerSchema } from './producer.schema';

@Injectable()
export class producerService {
  async getAll(): Promise<ProducerSchema[]> {
    try {
      const data = await ProducerModel.findAll({});
      return data;
    } catch (err) {
      throw new HttpException(err, HttpStatus.FORBIDDEN);
    }
  }
  async getOne(id: number) {
    const detail = await ProducerModel.findOne({
      where: {
        id: id,
      },
    });

    if (detail) {
      return detail;
    }
  }
  async create(producer: Partial<Producer>): Promise<Producer> {
    console.log(producer);
    const producerData = await ProducerModel.create(producer);
    return producerData;
  }

  async update(id: number, producer: Producer): Promise<any> {
    console.log('id', id);
    console.log(producer);

    const ProducerData = await ProducerModel.update(producer, {
      where: {
        id: id,
      },
    });
    return ProducerData;
  }
  async removeProducerTrashed(id: number) {
    console.log(id);
    const destroy = await ProducerModel.destroy({
      where: { id: id },
    });
    return destroy;
  }
}
