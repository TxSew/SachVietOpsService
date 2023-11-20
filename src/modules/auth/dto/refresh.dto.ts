import { IsString, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class RefreshDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
