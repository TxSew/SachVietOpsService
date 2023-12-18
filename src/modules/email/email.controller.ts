import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEmailDto } from './dto/create-email';
import { EmailService } from './email.service';
// import { RolesGuard } from 'src/auth/roles.guard';
// import { Roles } from 'src/auth/roles.decorator';
import { CreateEmailMultipleDto } from './dto/create-email-multiple';
import { CreateEmailTemplateDto } from './dto/create-email-template';
import { Public } from 'src/guard/jwtGuard';

@ApiTags('email')
@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Public()
    @Post()
    async sendMail(@Body() emailDto: CreateEmailDto): Promise<{
        message: string;
    }> {
        try {
            this.emailService.sendMail(emailDto);
            return { message: 'Email is sent...' };
        } catch (error) {
            return { message: 'Failed to send email...' };
        }
    }

    @Public()
    @Post('multiple')
    async sendMultipleMail(@Body() emailMultipleDto: CreateEmailMultipleDto): Promise<{
        message: string;
    }> {
        try {
            this.emailService.sendMultipleEmails(emailMultipleDto);
            return { message: 'Email is sent...' };
        } catch (error) {
            return { message: 'Failed to send email...' };
        }
    }

    @Public()
    @Post('template')
    async sendMaiTemplate(@Body() createEmailTemplateDto: CreateEmailTemplateDto): Promise<{
        message: string;
    }> {
        try {
            this.emailService.sendMailTemplate(createEmailTemplateDto);
            return { message: 'Email is sent...' };
        } catch (error) {
            return { message: 'Failed to send email...' };
        }
    }
}
