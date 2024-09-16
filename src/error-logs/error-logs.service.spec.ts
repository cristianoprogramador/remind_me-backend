import { Test, TestingModule } from "@nestjs/testing";
import { ErrorLogsService } from "./error-logs.service";
import { ErrorLogsRepository } from "./error-logs.repository";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("ErrorLogsService", () => {
  let service: ErrorLogsService;
  let repository: ErrorLogsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ErrorLogsService,
        {
          provide: ErrorLogsRepository,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ErrorLogsService>(ErrorLogsService);
    repository = module.get<ErrorLogsRepository>(ErrorLogsRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("logError", () => {
    it("should log an error with correct details", async () => {
      const exception = new HttpException("Forbidden", HttpStatus.FORBIDDEN);
      const request = {
        url: "/test-url",
        method: "GET",
        headers: {
          "user-agent": "Mozilla/5.0",
          referer: "http://example.com",
          "content-type": "application/json",
        },
      } as unknown as Request;

      const createSpy = jest
        .spyOn(repository, "create")
        .mockResolvedValue(null);

      await service.logError(exception, request);

      expect(createSpy).toHaveBeenCalledWith({
        statusCode: HttpStatus.FORBIDDEN,
        message: "Forbidden",
        error: "Forbidden",
        url: "/test-url",
        method: "GET",
        headers: JSON.stringify({
          "User-Agent": "Mozilla/5.0",
          Referer: "http://example.com",
          "Content-Type": "application/json",
        }),
      });
    });

    it("should handle generic error without HttpException", async () => {
      const exception = new Error("Something went wrong");
      const request = {
        url: "/test-url",
        method: "GET",
        headers: {
          "user-agent": "Mozilla/5.0",
          referer: "http://example.com",
          "content-type": "application/json",
        },
      } as unknown as Request;

      const createSpy = jest
        .spyOn(repository, "create")
        .mockResolvedValue(null);

      await service.logError(exception, request);

      expect(createSpy).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Something went wrong",
        error: "Internal Server Error",
        url: "/test-url",
        method: "GET",
        headers: JSON.stringify({
          "User-Agent": "Mozilla/5.0",
          Referer: "http://example.com",
          "Content-Type": "application/json",
        }),
      });
    });
  });

  describe("findOne", () => {
    it("should return an error log by uuid", async () => {
      const errorLog = {
        uuid: "1",
        statusCode: 500,
        message: "Error message",
        error: "Internal Server Error",
        url: "/test-url",
        method: "GET",
        headers: "{}",
        stackTrace: "stack trace",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(repository, "findOne").mockResolvedValue(errorLog);

      expect(await service.findOne("1")).toEqual(errorLog);
      expect(repository.findOne).toHaveBeenCalledWith("1");
    });
  });

  describe("findAll", () => {
    it("should return an array of error logs", async () => {
      const errorLogsArray = [
        {
          uuid: "1",
          statusCode: 500,
          message: "Error message",
          error: "Internal Server Error",
          url: "/test-url",
          method: "GET",
          headers: "{}",
          stackTrace: "stack trace",
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      jest.spyOn(repository, "findAll").mockResolvedValue({
        total: 1,
        errorLogs: errorLogsArray,
      });

      expect(await service.findAll(1, 10)).toEqual({
        total: 1,
        errorLogs: errorLogsArray,
      });
      expect(repository.findAll).toHaveBeenCalledWith(1, 10, undefined);
    });
  });
});
