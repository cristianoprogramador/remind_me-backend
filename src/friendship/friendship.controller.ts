import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  Delete,
} from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { GetUser } from "src/auth/get-user.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@ApiTags("Friendship")
@UseGuards(JwtAuthGuard)
@Controller("friendship")
@ApiBearerAuth()
export class FriendshipController {
  constructor(private friendshipService: FriendshipService) {}

  @Post("request")
  @ApiOperation({ summary: "Enviar solicitação de amizade" })
  @ApiResponse({ status: 201, description: "Solicitação enviada com sucesso." })
  @ApiResponse({
    status: 404,
    description: "E-mail não cadastrado ou incorreto.",
  })
  @ApiResponse({
    status: 409,
    description: "Uma amizade já existe ou está pendente.",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        friendEmail: { type: "string" },
      },
    },
  })
  async sendFriendRequest(
    @GetUser() user: { userId: string },
    @Body("friendEmail") friendEmail: string
  ) {
    return this.friendshipService.sendFriendRequest(user.userId, friendEmail);
  }

  @Get("requests")
  @ApiOperation({ summary: "Ver solicitações de amizade recebidas" })
  async getFriendRequests(@GetUser() user: { userId: string }) {
    return this.friendshipService.getFriendRequests(user.userId);
  }

  @Get("friends")
  @ApiOperation({ summary: "Listar amigos" })
  async getFriends(@GetUser() user: { userId: string }) {
    return this.friendshipService.getFriends(user.userId);
  }

  @Get("search")
  @ApiOperation({ summary: "Buscar usuário por e-mail" })
  async searchUser(
    @Query("email") email: string,
    @GetUser() user: { userId: string }
  ) {
    return this.friendshipService.searchUserByEmail(email, user.userId);
  }

  @Post("respond/:requestId")
  @ApiOperation({ summary: "Responder a uma solicitação de amizade" })
  async respondToFriendRequest(
    @Param("requestId") requestId: string,
    @Body("accept") accept: boolean,
    @GetUser() user: { userId: string }
  ) {
    return this.friendshipService.respondToFriendRequest(
      requestId,
      accept,
      user.userId
    );
  }

  @Delete(":friendId")
  @ApiOperation({ summary: "Desfazer amizade" })
  @ApiResponse({ status: 200, description: "Amizade desfeita com sucesso." })
  @ApiResponse({ status: 404, description: "Amizade não encontrada." })
  async unfriend(
    @GetUser() user: { userId: string },
    @Param("friendId") friendId: string
  ) {
    return this.friendshipService.unfriend(user.userId, friendId);
  }
}
