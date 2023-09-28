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
  @Get(':id')
  async GetOne(@Param('id') id: number) {
    return this.producerService.getOne(id);
  }
  @Post('store')
  create(@Body() data: Producer): Promise<Producer> {
    console.log(data);
    return this.producerService.create(data);
  }
  @Put('update/:id')
  update(@Param() id: any, @Body() data: Producer): Promise<Producer> {
    console.log(data, id);
    const Id: number = id.id;
    return this.producerService.update(Number(Id), data);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.producerService.remove(id);
  }
}
