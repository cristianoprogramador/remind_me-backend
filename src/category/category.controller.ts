import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { GetUser } from "../auth/get-user.decorator";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@ApiTags("Category")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: "Create a new category" })
  @ApiResponse({ status: 201, description: "Category successfully created" })
  async createCategory(
    @GetUser() user: { userId: string },
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    return this.categoryService.createCategory(user.userId, createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all categories for the logged-in user" })
  async getCategories(@GetUser() user: { userId: string }) {
    return this.categoryService.getCategories(user.userId);
  }

  @Delete(":categoryId")
  @ApiOperation({ summary: "Delete a category" })
  async deleteCategory(
    @GetUser() user: { userId: string },
    @Param("categoryId") categoryId: string
  ) {
    return this.categoryService.deleteCategory(user.userId, categoryId);
  }
}
