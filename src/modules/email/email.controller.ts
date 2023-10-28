import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email';
// import { RolesGuard } from 'src/auth/roles.guard';
// import { Roles } from 'src/auth/roles.decorator';
import { CreateEmailTemplateDto } from './dto/create-email-template';
import { CreateEmailMultipleDto } from './dto/create-email-multiple';

@ApiTags('email')
@Controller('email')
// @UseGuards(RolesGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  // @Roles('ADMIN')
  async sendMail(@Body() emailDto: CreateEmailDto): Promise<{
    message: string
  }> {
    try {
      this.emailService.sendMail(emailDto);
      return { message: 'Email is sent...' };
    } catch (error) {
      console.log(error);
      return { message: 'Failed to send email...' };
    }
  }

  @Post('multiple')
  async sendMultipleMail(
    @Body() emailMultipleDto: CreateEmailMultipleDto,
  ): Promise<{
    message:string
  }> {
    try {
      this.emailService.sendMultipleEmails(emailMultipleDto);
      return { message: 'Email is sent...' };
    } catch (error) {
      console.log(error);
      return { message: 'Failed to send email...' };
    }
  }

  @Post('template')
  async sendMaiTemplate(
    @Body() createEmailTemplateDto: CreateEmailTemplateDto,
  ): Promise<{
    message:string
  }> {
    try {
      this.emailService.sendMailTemplate(createEmailTemplateDto);
      return { message: 'Email is sent...' };
    } catch (error) {
      console.log(error);
      return { message: 'Failed to send email...' };
    }
  }
}
