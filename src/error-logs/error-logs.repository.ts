// src/error-logs/error-logs.repository.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ErrorLogsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.errorLogs.create({ data });
  }

  async findOne(uuid: string) {
    return this.prisma.errorLogs.findUnique({
      where: { uuid },
    });
  }

  async findAll(page: number, itemsPerPage: number, search?: string) {
    const skip = (page - 1) * itemsPerPage;
    const where = search
      ? {
          OR: [
            { message: { contains: search } },
            { error: { contains: search } },
          ],
        }
      : {};

    const [total, errorLogs] = await Promise.all([
      this.prisma.errorLogs.count({ where }),
      this.prisma.errorLogs.findMany({
        where,
        skip,
        take: itemsPerPage,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      total,
      errorLogs,
    };
  }
}
