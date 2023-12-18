import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Producer, TProducer } from 'src/submodules/models/producerModel/producer';
import { ProducerService } from './producer.service';

import { ApiTags } from '@nestjs/swagger';
import { ProducerQueyDto } from './dto/query-producer';
import { Public } from 'src/guard/jwtGuard';
@ApiTags('producer')
@Controller('producer')
export class ProducerController {
    constructor(private readonly producerService: ProducerService) {}
    @Public()
    @Get('getList')
    async getList(): Promise<any> {
        return this.producerService.getAll();
    }

    @Public()
    @Post('')
    async getAll(@Body() query): Promise<any> {
        return this.producerService.getListProducer(query);
    }

    @Get(':id')
    async getProducer(@Param('id') id: number) {
        return this.producerService.getProducer(id);
    }

    @Post('store')
    createProducer(@Body() data: Producer): Promise<Producer> {
        return this.producerService.createProducer(data);
    }

    @Put('update/:id')
    updateProducer(@Param() id: number, @Body() data: Producer) {
        return this.producerService.update(Number(id), data);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.producerService.removeProducerTrashed(id);
    }
}
