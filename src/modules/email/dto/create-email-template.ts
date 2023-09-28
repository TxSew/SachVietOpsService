import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { template } from 'handlebars';

export class CreateEmailTemplateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  to?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject?: string;

  @IsNotEmpty()
  @IsString()
  template: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  context?: { [key: string]: string };
}
