import { Module } from '@nestjs/common';
import { StatisticalController } from './statistical.controller';
import { StatisticalService } from './statistical.service';

@Module({
  imports: [],
  controllers: [StatisticalController],
  providers: [StatisticalService],
})
export class StatisticalModule {}
