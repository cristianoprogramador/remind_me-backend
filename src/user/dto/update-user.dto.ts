// src/user/dto/update-user.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    description: "Novo nome do usuário",
    example: "John Doe",
  })
  @IsString()
  @IsNotEmpty({ message: "O nome não pode estar vazio" })
  @Length(3, 50, { message: "O nome deve ter entre 3 e 50 caracteres" })
  name: string;
}
