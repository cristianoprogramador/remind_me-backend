// src/annotations/dto/create-annotation.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, IsOptional, IsDate } from "class-validator";

export class CreateAnnotationDto {
  @ApiProperty({ description: "Content of the annotation" })
  @IsString()
  content: string;

  @ApiProperty({ description: "Reminder date and time" })
  @IsDate()
  remindAt: Date;

  @ApiProperty({ description: "Category ID", example: "UUID" })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ description: "Related User IDs", example: ["UUID1", "UUID2"] })
  @IsUUID(undefined, { each: true })
  @IsOptional()
  relatedUserIds?: string[];
}
