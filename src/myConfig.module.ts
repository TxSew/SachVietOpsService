import { Module } from '@nestjs/common';
import { MyConfigService } from './myConfig.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [MyConfigService],
  exports: [MyConfigService]
})
export class MyConfigModule {}
