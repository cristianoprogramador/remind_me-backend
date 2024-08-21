// src/category/dto/create-category.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({
    description: "The name of the category",
    example: "Work",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
