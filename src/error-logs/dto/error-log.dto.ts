// src/error-logs/dto/error-log.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class ErrorLogDto {
  @ApiProperty({ example: "c9d3a24a-eda7-4d7d-b321-68f3f0c0c5d7" })
  uuid: string;

  @ApiProperty({ example: 500 })
  statusCode: number;

  @ApiProperty({ example: "Internal Server Error" })
  message: string;

  @ApiProperty({ example: "Unexpected error occurred" })
  error: string;

  @ApiProperty({ example: "/api/test" })
  url: string;

  @ApiProperty({ example: "GET" })
  method: string;

  @ApiProperty({
    example: '{"User-Agent":"Mozilla/5.0","Referer":"http://example.com"}',
  })
  headers: string;

  @ApiProperty({ example: "2024-06-07T12:34:56.789Z" })
  createdAt: string;
}
