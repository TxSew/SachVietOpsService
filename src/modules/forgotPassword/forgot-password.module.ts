import { Module } from "@nestjs/common";
import { OtpController } from "./forgot-password.controller";
import { OtpService } from "./forgot-password.service";

@Module({
  controllers: [OtpController],
  providers: [OtpService], // Thêm MyConfigService vào mảng providers
  imports: [
    // UsersModule,
    // EmailModule,
    // JwtModule.registerAsync({
    //   imports: [MyConfigModule],
    //   inject: [MyConfigService],
    //   //   useFactory: async (myConfigService: MyConfigService) => ({
    //   // secret: myConfigService.getToken,
    //   // signOptions: {
    //   //   expiresIn: myConfigService.getExpiresInForgotPassword,
    //   // },
    //   //   }),
    // }),
  ],
})
export class OptModule {}
