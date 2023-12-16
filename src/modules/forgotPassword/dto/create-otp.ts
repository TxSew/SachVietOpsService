import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOtpDto {
    @IsNumber()
    id: string;

    @ApiProperty({ example: 'example@example.com' })
    @IsNotEmpty({ message: 'Email should not be empty' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty({ message: 'Code should not be empty' })
    @IsString({ message: 'Code should be a string' })
    code: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty({ message: 'Code should not be empty' })
    @IsString({ message: 'Code should be a string' })
    token: string;
}
