// src/error-logs/error-logs.service.ts
import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import { ErrorLogsRepository } from "./error-logs.repository";

@Injectable()
export class ErrorLogsService {
  constructor(private errorLogsRepository: ErrorLogsRepository) {}

  async logError(exception: Error, request: Request) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const response =
      exception instanceof HttpException ? exception.getResponse() : {};

    const error =
      exception instanceof HttpException &&
      typeof response === "object" &&
      "error" in response
        ? response["error"]
        : status === HttpStatus.FORBIDDEN
          ? "Forbidden"
          : "Internal Server Error";

    const filteredHeaders = {
      "User-Agent": request.headers["user-agent"],
      Referer: request.headers["referer"],
      "Content-Type": request.headers["content-type"],
    };

    await this.errorLogsRepository.create({
      statusCode: status,
      message:
        typeof response === "object" && "message" in response
          ? response["message"]
          : exception.message || "Unexpected error occurred",
      error: error,
      url: request.url,
      method: request.method,
      headers: JSON.stringify(filteredHeaders),
    });
  }

  async findOne(uuid: string) {
    return await this.errorLogsRepository.findOne(uuid);
  }

  async findAll(page: number, itemsPerPage: number, search?: string) {
    return await this.errorLogsRepository.findAll(page, itemsPerPage, search);
  }

  formatResponse(exception: any) {
    if (exception.response) {
      return exception.response;
    } else if (exception instanceof Error && exception.message) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: "Internal Server Error",
      };
    } else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Unexpected error occurred",
        error: "Internal Server Error",
      };
    }
  }
}
