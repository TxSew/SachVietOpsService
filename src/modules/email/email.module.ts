import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MyConfigModule } from 'src/myConfig.module';
import { join } from 'path';
import { MyConfigService } from 'src/myConfig.service';

@Module({
    imports: [
        JwtModule,
        MailerModule.forRootAsync({
            inject: [MyConfigService],
            imports: [MyConfigModule],
            useFactory: (config: MyConfigService) => ({
                transport: {
                    host: config.getEmailHost,
                    port: 587,
                    tls: { rejectUnauthorized: false },
                    secure: false,
                    auth: {
                        user: config.getEmail,
                        pass: config.getEmailPassword,
                    },
                },

                defaults: {
                    from: `"No Reply"`,
                },

                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    controllers: [EmailController],
    providers: [EmailService, ConfigService, MyConfigService],
    exports: [EmailService, ConfigService, MyConfigService],
})
export class EmailModule {}
