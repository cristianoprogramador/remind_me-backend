// src/user/user.controller.ts

import { Controller, Put, Body, Get, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/update-user.dto";
import { GetUser } from "src/auth/get-user.decorator";

@ApiTags("User")
@UseGuards(JwtAuthGuard)
@Controller("user")
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Put("name")
  @ApiOperation({ summary: "Atualizar nome do usuário" })
  @ApiResponse({
    status: 200,
    description: "Nome do usuário atualizado com sucesso.",
  })
  async updateUserName(
    @GetUser() user: { userId: string },
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.updateUserName(user.userId, updateUserDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar informações do usuário" })
  @ApiResponse({
    status: 200,
    description: "Informações do usuário recuperadas com sucesso.",
  })
  async getUser(@Param("id") id: string) {
    return this.userService.getUserById(id);
  }
}
