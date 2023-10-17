import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Delete,
} from "@nestjs/common";
import { ProducerService } from "./producer.service";
import {
  Producer,
  TProducer,
} from "src/submodules/models/producerModel/producer";

import { ApiTags } from "@nestjs/swagger";
import { BaseModel } from "src/submodules/models/BaseModel";
import { ProducerQueyDto } from "./dto/query-producer";
@ApiTags("producer")
@Controller("producer")
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}
  @Get("")
  getAll(@Query() query: ProducerQueyDto): Promise<TProducer> {
    return this.producerService.getAll(query);
  }
  @Get(":id")
  async GetOne(@Param("id") id: number) {
    return this.producerService.getOne(id);
  }
  @Post("store")
  create(@Body() data: Producer): Promise<Producer> {
    console.log(data);
    return this.producerService.create(data);
  }
  @Put("update/:id")
  update(@Param() id: number, @Body() data: Producer) {
    return this.producerService.update(Number(id), data);
  }
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.producerService.removeProducerTrashed(id);
  }
}
