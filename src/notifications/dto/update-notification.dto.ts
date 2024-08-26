// src/notifications/dto/update-notification.dto.ts

import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateNotificationDto {
  @ApiProperty({ description: "Ativar ou desativar notificações por email" })
  @IsBoolean()
  @IsOptional()
  emailNotify?: boolean;

  @ApiProperty({ description: "Número de telefone para notificações" })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ description: "Ativar ou desativar notificações por SMS" })
  @IsBoolean()
  @IsOptional()
  phoneNotify?: boolean;

  @ApiProperty({ description: "Ativar ou desativar notificações semanais" })
  @IsBoolean()
  @IsOptional()
  weeklySummary?: boolean;
}
