import { Module } from '@nestjs/common';
import { ProducerController } from './producer.controller';
import { producerService } from './producer.service';

@Module({
  imports: [],
  controllers: [ProducerController],
  providers: [producerService],
})
export class ProducerModule {}
