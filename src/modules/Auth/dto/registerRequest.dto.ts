import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDTO {
  @ApiProperty({
    example: '123456',
    description: 'Password',
  })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string;

  @ApiProperty({
    example: 'email@example.com',
    description: 'Email address',
  })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name',
  })
  @IsNotEmpty({ message: 'fullName should not be empty' })
  @IsString({ message: 'Full name must be a string' })
  readonly fullName: string;
}
