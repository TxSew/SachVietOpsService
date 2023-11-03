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
    @Get('')
    getAll(@Query() query: ProducerQueyDto): Promise<TProducer> {
        return this.producerService.getAll(query);
    }

    @Get(':id')
    async GetOne(@Param('id') id: number) {
        return this.producerService.getOne(id);
    }

    @Public()
    @Post('store')
    create(@Body() data: Producer): Promise<Producer> {
        console.log(data);
        return this.producerService.create(data);
    }

    @Put('update/:id')
    update(@Param() id: number, @Body() data: Producer) {
        return this.producerService.update(Number(id), data);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.producerService.removeProducerTrashed(id);
    }
}
