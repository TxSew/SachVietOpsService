import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class MyConfigService {
  constructor(private configService: ConfigService) {}
  // send mail
  get getEmail(): string {
    return this.configService.get<string>("EMAIL_NAME");
  }

  get getEmailPassword(): string {
    return this.configService.get<string>("EMAIL_PASS");
  }

  get getEmailHost(): string {
    return this.configService.get<string>("EMAIL_HOST");
  }


  //jwt 
  get getExpiresIn(): string {
    return this.configService.get<string>("JWT_EXPIRES_IN");
  }

  get getExpiresInForgotPassword(): string {
    return this.configService.get<string>("JWT_EXPIRES_IN_FORGOT_PASSWORD");
  }

  get getEnvironment(): string {
    return this.configService.get<string>("ENVIRONMENTS");
  }

  // stripe
  get getStripeSecretKey(): string {
    return this.configService.get<string>("SECRET_KEY_STRIPE");
  }
  get getStripeSuccessUrl(): string {
    return this.configService.get<string>("STRIPE_SUCCESS_URL");
  }

  get getStripeCancelUrl(): string {
    return this.configService.get<string>("STRIPE_CANCEL_URL");
  }


  // Other getters for other config values
}
