// src/annotations/dto/update-annotation.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsUUID,
  IsOptional,
  IsDate,
  ValidateNested,
  IsArray,
} from "class-validator";

class RelatedUserDto {
  @ApiProperty({ description: "User ID", example: "UUID" })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: "Annotation ID", example: "UUID" })
  @IsUUID()
  annotationId: string;
}

export class UpdateAnnotationDto {
  @ApiProperty({ description: "Content of the annotation" })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: "Reminder date and time" })
  @IsDate()
  @IsOptional()
  remindAt?: Date;

  @ApiProperty({ description: "Category ID", example: "UUID" })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ type: [RelatedUserDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  relatedUsers?: RelatedUserDto[];
}
