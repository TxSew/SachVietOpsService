import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEmailMultipleDto {
  @ApiProperty()
  @IsNotEmpty()
  emails?: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  body?: string;
}
