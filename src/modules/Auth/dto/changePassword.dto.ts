import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDTO {
  @ApiProperty({ example: "user123" })
  @IsNotEmpty({ message: "User ID should not be empty" })
  @IsString({ message: "User ID should be a string" })
  userId: string;

  @ApiProperty({ example: "oldPassword123" })
  @IsNotEmpty({ message: "Old password should not be empty" })
  @IsString({ message: "Old password should be a string" })
  readonly password: string;

  @ApiProperty({ example: "newPassword456" })
  @IsNotEmpty({ message: "New password should not be empty" })
  @IsString({ message: "New password should be a string" })
  @MinLength(6, {
    message: "New password should be at least 6 characters long",
  })
  readonly newPassword: string;

  @ApiProperty({ example: "newPassword456" })
  @IsNotEmpty({ message: "Repeat new password should not be empty" })
  @IsString({ message: "Repeat new password should be a string" })
  @MinLength(6, {
    message: "Repeat new password should be at least 6 characters long",
  })
  readonly repeatNewPassword: string;
}
