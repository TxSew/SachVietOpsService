import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { ProducerModel, ProducerSchema } from './producer.schema';
import { Producer } from 'src/submodules/models/producerModel/producer';
import { where } from 'sequelize';

@Injectable()
export class producerService {
  async getAll(): Promise<ProducerSchema[]> {
     try {
    const data = await ProducerModel.findAll({});
    return data;
     }
      catch(err){
         throw new HttpException(err, HttpStatus.FORBIDDEN)
      }
  }
  async create(producer: Partial<Producer>): Promise<Producer> {
    console.log(producer);
    const producerData = await ProducerModel.create(producer);
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
