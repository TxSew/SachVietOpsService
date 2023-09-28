import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';

@Module({
  imports: [],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class AppModule {}
