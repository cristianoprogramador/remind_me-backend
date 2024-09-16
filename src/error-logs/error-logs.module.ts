// src/error-logs/error-logs.module.ts

import { Module } from "@nestjs/common";
import { ErrorLogsController } from "./error-logs.controller";
import { ErrorLogsService } from "./error-logs.service";
import { ErrorLogsRepository } from "./error-logs.repository";

@Module({
  controllers: [ErrorLogsController],
  providers: [ErrorLogsService, ErrorLogsRepository],
  exports: [ErrorLogsService],
})
export class ErrorLogsModule {}
