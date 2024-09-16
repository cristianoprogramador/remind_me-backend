// src/error-logs/custom-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { ErrorLogsService } from "./error-logs.service";

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private errorLogsService: ErrorLogsService) {}

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    await this.errorLogsService.logError(exception, request);

    response.status(status).json({
      statusCode: status,
      message: exception.message || "Unexpected error occurred",
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
