import { IsNotEmpty, IsString, MinLength, Equals } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class NewPasswordDTO {
  @ApiProperty({ example: "newpassword123" })
  @IsNotEmpty({ message: "New password should not be empty" })
  @IsString({ message: "New password should be a string" })
  @MinLength(6, {
    message: "New password should be at least 6 characters long",
  })
  readonly newPassword?: string;

  @ApiProperty({ example: "newpassword123" })
  @IsNotEmpty({ message: "Repeated new password should not be empty" })
  @IsString({ message: "Repeated new password should be a string" })
  @Equals("newPassword", {
    message: "Repeated password must match the new password",
  })
  readonly repeatNewPassword?: string;
}
