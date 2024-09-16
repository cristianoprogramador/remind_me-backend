// src/error-logs/dto/paginated-error-logs.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { ErrorLogDto } from "./error-log.dto";

export class PaginatedErrorLogsDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ type: [ErrorLogDto] })
  errorLogs: ErrorLogDto[];
}
