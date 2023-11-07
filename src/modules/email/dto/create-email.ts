import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  to?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  body?: string;
}
