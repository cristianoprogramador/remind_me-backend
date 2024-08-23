// src/annotations/annotations.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAnnotationDto } from "./dto/create-annotation.dto";
import { UpdateAnnotationDto } from "./dto/update-annotation.dto";

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
    });
  }

  async update(annotationId: string, updateAnnotationDto: UpdateAnnotationDto) {
    console.log(annotationId);
    console.log(updateAnnotationDto);

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

  async findUserAnnotations(userId: string, onlyFuture: boolean) {
    const now = new Date();

    return this.prisma.annotation.findMany({
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
    });
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
