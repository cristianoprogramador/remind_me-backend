// src/annotations/annotations.module.ts

import { Module } from "@nestjs/common";
import { AnnotationsService } from "./annotations.service";
import { AnnotationsController } from "./annotations.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [AnnotationsController],
  providers: [AnnotationsService, PrismaService],
})
export class AnnotationsModule {}
