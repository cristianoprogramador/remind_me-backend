// src/annotations/annotations.service.ts

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAnnotationDto } from "./dto/create-annotation.dto";

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
        relatedUserId: createAnnotationDto.relatedUserId,
      },
    });
  }

  async findAll() {
    return this.prisma.annotation.findMany({
      include: {
        author: true,
        category: true,
        relatedUser: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.annotation.findUnique({
      where: { uuid: id },
      include: {
        author: true,
        category: true,
        relatedUser: true,
      },
    });
  }
}
