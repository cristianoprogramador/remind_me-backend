// src/user/user.controller.ts

import {
  Controller,
  Put,
  Body,
  Get,
  Param,
  UseGuards,
  Delete,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/update-user.dto";
import { GetUser } from "src/auth/get-user.decorator";
import { CreateUserDto } from "src/auth/dto/create-user.dto";

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

  @Get("list")
  @ApiOperation({ summary: "List all users" })
  @ApiQuery({ name: "page", required: true, type: Number, example: 1 })
  @ApiQuery({ name: "itemsPerPage", required: true, type: Number, example: 10 })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiResponse({
    status: 200,
    description: "List of users",
    type: [CreateUserDto],
  })
  findAll(
    @Query("page") page: string,
    @Query("itemsPerPage") itemsPerPage: string,
    @Query("search") search?: string
  ) {
    return this.userService.findAll(+page, +itemsPerPage, search);
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

  @Delete(":id")
  @ApiOperation({ summary: "Excluir usuário e todos os dados relacionados" })
  @ApiResponse({
    status: 200,
    description: "Usuário excluído com sucesso.",
  })
  async deleteUser(@Param("id") id: string) {
    return this.userService.deleteUser(id);
  }
}
