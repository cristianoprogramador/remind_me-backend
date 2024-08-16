// dto/login-user.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({ description: "The email of the user" })
  email: string;

  @ApiProperty({ description: "The password of the user" })
  password: string;
}
