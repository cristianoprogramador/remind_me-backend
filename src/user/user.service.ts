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
}
