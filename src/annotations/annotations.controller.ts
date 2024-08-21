// src/annotations/annotations.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { AnnotationsService } from "./annotations.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CreateAnnotationDto } from "./dto/create-annotation.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { GetUser } from "src/auth/get-user.decorator";

@ApiTags("Annotations")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller("annotations")
export class AnnotationsController {
  constructor(private readonly annotationsService: AnnotationsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new annotation" })
  @ApiResponse({ status: 201, description: "Annotation successfully created" })
  async create(
    @GetUser() user: { userId: string },
    @Body() createAnnotationDto: CreateAnnotationDto
  ) {
    return this.annotationsService.create(user.userId, createAnnotationDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all annotations" })
  @ApiResponse({ status: 200, description: "List of annotations" })
  async findAll() {
    return this.annotationsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single annotation by ID" })
  @ApiResponse({ status: 200, description: "Single annotation found" })
  @ApiResponse({ status: 404, description: "Annotation not found" })
  async findOne(@Param("id") id: string) {
    return this.annotationsService.findOne(id);
  }
}
