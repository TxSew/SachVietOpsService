import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { MyConfigService } from "src/myConfig.service";
import { CreateEmailDto } from "./dto/create-email";
import { CreateEmailMultipleDto } from "./dto/create-email-multiple";
import { CreateEmailTemplateDto } from "./dto/create-email-template";
@Injectable()
export class EmailService {
  private transporter;
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly myConfigService: MyConfigService
  ) {
    this.transporter = nodemailer.createTransport({
      host: myConfigService.getEmailHost,
      port: 587,
      secure: false,
      auth: {
        user: this.myConfigService.getEmail,
        pass: this.myConfigService.getEmailPassword,
      },
    });
  }

  // @UseGuards(AuthGuard('jwt'))
  async sendMail(email: CreateEmailDto): Promise<void> {
    const mailOptions = {
      from: this.myConfigService.getEmail,
      to: email.to,
      subject: email.subject,
      text: email.body,
    };

    await this.transporter.sendMail(mailOptions);
  }
  async sendMailTemplate(email: CreateEmailTemplateDto): Promise<void> {
    const mailOptions = {
      from: this.myConfigService.getEmail,
      to: email.to,
      subject: email.subject,
      template: email.template,
      context: email.context,
    };
    await this.mailerService
      .sendMail(mailOptions)
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }
  async sendMultipleEmails(emailData: CreateEmailMultipleDto): Promise<void> {
    const mailPromises = emailData.emails.map((toEmail) => {
      const mailOptions = {
        from: this.myConfigService.getEmail,
        to: toEmail,
        subject: emailData.subject,
        template: "base",
        context: {
          content: emailData.body,
        },
      };
      console.log(mailOptions);
      return this.mailerService.sendMail(mailOptions);
    });
    try {
      await Promise.all(mailPromises);
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  }
}
