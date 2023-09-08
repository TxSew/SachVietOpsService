import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { producerService } from './producer.service';
import { ProducerSchema } from './producer.schema';
import { Producer } from 'src/submodules/models/producerModel/producer';

import { ApiTags } from '@nestjs/swagger';
import { BaseModel } from 'src/submodules/models/BaseModel';
@ApiTags('producer')
@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: producerService) {}
  @Get()
  getAll(): Promise<ProducerSchema[]> {
    return this.producerService.getAll();
  }

  @Post('store')
  create(@Body() data: Producer): Promise<Producer> {
    console.log(data);
    return this.producerService.create(data);
  }
  @Put('update/:id')
  update(@Param() id: string, @Body() data: Producer): Promise<Producer> {
    console.log(data, id);
    return this.producerService.update(id, data);
  }
  @Delete(':id')
  remove(@Param('id') id: BaseModel) {
    const producerID = id.id;
    return this.producerService.remove(producerID);
  }
}
