import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OtpCodeDto {
  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'OTP code should not be empty' })
  @IsString({ message: 'OTP code should be a string' })
  readonly otp?: string;
}
