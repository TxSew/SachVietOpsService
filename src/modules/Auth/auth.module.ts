import { Module } from '@nestjs/common';
import { AccountController } from './auth.controller';
import { AccountService } from './auth.service';

@Module({
  imports: [],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AppModule {}
