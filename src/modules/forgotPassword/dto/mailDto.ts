import { IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MailDto {
  @ApiProperty({ example: 'example@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email?: string;
}
