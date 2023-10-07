import { Module } from "@nestjs/common";
import { OtpService } from "./forgot-password.service";
import { OtpController } from "./forgot-password.controller";

@Module({
  imports: [],
  providers: [OtpService],
  controllers: [OtpController],
})
export class OptModule {}
