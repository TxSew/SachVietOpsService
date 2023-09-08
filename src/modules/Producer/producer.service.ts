import { Injectable, Param } from '@nestjs/common';
import { ProducerModel, ProducerSchema } from './producer.schema';
import { Producer } from 'src/submodules/models/producerModel/producer';
import { where } from 'sequelize';

@Injectable()
export class producerService {
  async getAll(): Promise<ProducerSchema[]> {
    const data = await ProducerModel.findAll({});
    return data;
  }
  async create(data: Partial<Producer>): Promise<Producer> {
    console.log(data);
    const producerData = await ProducerModel.create(data);
    return producerData;
  }

  async update(id: string, data: Partial<Producer>): Promise<Producer> {
    ProducerModel.update(data, {
      where: {
        id: { id },
      },
    }).then((result) => {
      console.log(result);
    });

    // if (!updatedProducer) {
    //   throw 'Producer not found';
    // }
    return;
  }
  async remove(id: number) {
    const destroy = await ProducerModel.destroy({
      where: { id: id },
    });
    return destroy;
  }
}
