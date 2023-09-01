import { Module } from '@nestjs/common';
import { CustomerController } from './auth.controller';
import { CustomerService } from './auth.service';

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class AppModule {}
