import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MyConfigService {
  constructor(private configService: ConfigService) {}
  get getEmail(): string {
    return this.configService.get<string>('EMAIL_NAME');
  }

  get getEmailPassword(): string {
    return this.configService.get<string>('EMAIL_PASS');
  }

  get getExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN');
  }

  get getExpiresInForgotPassword(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN_FORGOT_PASSWORD');
  }

  get getEnvironment(): string {
    return this.configService.get<string>('ENVIRONMENTS');
  }

  get getEmailHost(): string {
    return this.configService.get<string>('EMAIL_HOST');
  }

  // Other getters for other config values
}
