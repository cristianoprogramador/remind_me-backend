// src/user/user.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUserName(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { uuid: userId } });
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    return this.prisma.user.update({
      where: { uuid: userId },
      data: { name: updateUserDto.name },
    });
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { uuid: userId },
    });
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { uuid: userId } });
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    await this.prisma.annotation.deleteMany({ where: { authorId: userId } });
    await this.prisma.notification.deleteMany({ where: { userId: userId } });
    await this.prisma.category.deleteMany({ where: { userId: userId } });
    await this.prisma.friendship.deleteMany({ where: { user1Id: userId } });
    await this.prisma.friendship.deleteMany({ where: { user2Id: userId } });

    return this.prisma.user.delete({ where: { uuid: userId } });
  }

  async findAll(page: number, itemsPerPage: number, search?: string) {
    const skip = (page - 1) * itemsPerPage;
    const where = search
      ? {
          OR: [{ email: { contains: search } }],
        }
      : {};

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: itemsPerPage,
        orderBy: { createdAt: "desc" },
        select: {
          uuid: true,
          email: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      total,
      users,
    };
  }
}
