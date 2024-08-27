// src/annotations/annotations.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAnnotationDto } from "./dto/create-annotation.dto";
import { UpdateAnnotationDto } from "./dto/update-annotation.dto";
import { isUUID } from "class-validator";

@Injectable()
export class AnnotationsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, createAnnotationDto: CreateAnnotationDto) {
    return this.prisma.annotation.create({
      data: {
        content: createAnnotationDto.content,
        remindAt: createAnnotationDto.remindAt,
        authorId: authorId,
        categoryId: createAnnotationDto.categoryId || null,
        relatedUsers: {
          create: createAnnotationDto.relatedUserIds?.map((userId) => ({
            user: {
              connect: { uuid: userId },
            },
          })),
        },
      },
      include: {
        author: true,
        category: true,
        relatedUsers: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async update(annotationId: string, updateAnnotationDto: UpdateAnnotationDto) {
    return this.prisma.annotation.update({
      where: { uuid: annotationId },
      data: {
        content: updateAnnotationDto.content,
        remindAt: updateAnnotationDto.remindAt,
        categoryId: updateAnnotationDto.categoryId || null,
        relatedUsers: {
          deleteMany: { annotationId },
          create: updateAnnotationDto.relatedUsers?.map((user) => ({
            userId: user.userId,
          })),
        },
      },
    });
  }

  async updateRemindAt(userId: string, annotationId: string, remindAt: Date) {
    const annotation = await this.prisma.annotation.findUnique({
      where: { uuid: annotationId },
      select: { authorId: true },
    });

    if (!annotation) {
      throw new NotFoundException("Annotation not found");
    }

    if (annotation.authorId !== userId) {
      throw new ForbiddenException(
        "You are not allowed to update this annotation"
      );
    }

    return this.prisma.annotation.update({
      where: { uuid: annotationId },
      data: { remindAt },
    });
  }

  async findUserAnnotations(
    userId: string,
    onlyFuture: boolean,
    page: number,
    limit: number
  ) {
    const now = new Date();
    const skip = (page - 1) * limit;
    const take = limit;

    const annotations = await this.prisma.annotation.findMany({
      where: {
        authorId: userId,
        ...(onlyFuture && {
          remindAt: {
            gte: now,
          },
        }),
      },
      include: {
        author: true,
        category: true,
        relatedUsers: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        remindAt: "asc",
      },
      skip,
      take,
    });

    const totalCount = await this.prisma.annotation.count({
      where: {
        authorId: userId,
        ...(onlyFuture && {
          remindAt: {
            gte: now,
          },
        }),
      },
    });

    return {
      annotations,
      totalCount,
      page,
      limit,
    };
  }

  async searchAnnotations(
    userId: string,
    query: string,
    categoryId: string,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;
    const now = new Date();

    const searchConditions: any = {
      authorId: userId,
      remindAt: {
        gte: now,
      },
    };

    if (query) {
      searchConditions.content = {
        contains: query,
        mode: "insensitive",
      };
    }

    if (categoryId && isUUID(categoryId)) {
      searchConditions.categoryId = categoryId;
    }

    const annotations = await this.prisma.annotation.findMany({
      where: searchConditions,
      include: {
        author: true,
        category: true,
        relatedUsers: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        remindAt: "asc",
      },
      skip,
      take: limit,
    });

    const totalCount = await this.prisma.annotation.count({
      where: searchConditions,
    });

    return {
      annotations,
      totalCount,
      page,
      limit,
    };
  }

  async findAll() {
    return this.prisma.annotation.findMany({
      include: {
        author: true,
        category: true,
        relatedUsers: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.annotation.findUnique({
      where: { uuid: id },
      include: {
        author: true,
        category: true,
        relatedUsers: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
