import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginRequestDTO {
    @ApiProperty({
        example: 'admin@gmail.com',
       description: 'email',
    })
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    readonly email: string;

    @ApiProperty({
        example: '123456',
        description: 'password',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
}
