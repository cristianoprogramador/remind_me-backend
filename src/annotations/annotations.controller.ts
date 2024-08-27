// src/annotations/annotations.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Patch,
  Put,
} from "@nestjs/common";
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
import { UpdateAnnotationDto } from "./dto/update-annotation.dto";

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

  @Put(":id")
  @ApiOperation({ summary: "Update an annotation" })
  @ApiResponse({ status: 200, description: "Annotation updated" })
  async update(
    @Param("id") id: string,
    @Body() updateAnnotationDto: UpdateAnnotationDto
  ) {
    return this.annotationsService.update(id, updateAnnotationDto);
  }

  @Patch(":id/remindAt")
  @ApiOperation({ summary: "Update the remindAt of an annotation" })
  @ApiResponse({ status: 200, description: "RemindAt updated successfully" })
  async updateRemindAt(
    @GetUser() user: { userId: string },
    @Param("id") id: string,
    @Body("remindAt") remindAt: Date
  ) {
    return this.annotationsService.updateRemindAt(user.userId, id, remindAt);
  }

  @Get("user")
  @ApiOperation({ summary: "Get user annotations" })
  @ApiResponse({ status: 200, description: "List of user annotations" })
  async findUserAnnotations(
    @GetUser() user: { userId: string },
    @Query("onlyFuture") onlyFuture: boolean,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10"
  ) {
    return this.annotationsService.findUserAnnotations(
      user.userId,
      onlyFuture,
      parseInt(page),
      parseInt(limit)
    );
  }

  @Get("search")
  @ApiOperation({ summary: "Search annotations by content or category" })
  @ApiResponse({
    status: 200,
    description: "List of annotations based on search criteria",
  })
  async searchAnnotations(
    @GetUser() user: { userId: string },
    @Query("query") query: string = "",
    @Query("categoryId") categoryId: string = "",
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10"
  ) {
    return this.annotationsService.searchAnnotations(
      user.userId,
      query,
      categoryId,
      parseInt(page),
      parseInt(limit)
    );
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
