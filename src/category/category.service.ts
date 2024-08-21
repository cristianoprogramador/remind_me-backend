import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(userId: string, createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        userId,
      },
    });
  }

  async getCategories(userId: string) {
    return this.prisma.category.findMany({
      where: {
        userId,
      },
    });
  }

  async deleteCategory(userId: string, categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { uuid: categoryId },
    });

    if (!category || category.userId !== userId) {
      throw new NotFoundException(
        "Category not found or you are not the owner"
      );
    }

    return this.prisma.category.delete({
      where: { uuid: categoryId },
    });
  }
}
