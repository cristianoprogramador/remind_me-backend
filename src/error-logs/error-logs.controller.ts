// src\error-logs\error-logs.controller.ts

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ErrorLogsService } from "./error-logs.service";
import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ErrorLogDto } from "./dto/error-log.dto";
import { PaginatedErrorLogsDto } from "./dto/paginated-error-logs.dto";

@ApiTags("ErrorLogs")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller("errorLogs")
export class ErrorLogsController {
  constructor(private readonly errorLogsService: ErrorLogsService) {}

  @Get("list")
  @ApiOperation({ summary: "List error logs" })
  @ApiQuery({ name: "page", required: true, type: Number, example: 1 })
  @ApiQuery({ name: "itemsPerPage", required: true, type: Number, example: 10 })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "List of error logs",
    type: PaginatedErrorLogsDto,
  })
  findAll(
    @Query("page") page: string,
    @Query("itemsPerPage") itemsPerPage: string,
    @Query("search") search?: string
  ) {
    return this.errorLogsService.findAll(+page, +itemsPerPage, search);
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get error log by ID" })
  @ApiResponse({
    status: 200,
    description: "Details of an error log",
    type: ErrorLogDto,
  })
  findOne(@Param("uuid") uuid: string) {
    return this.errorLogsService.findOne(uuid);
  }
}
