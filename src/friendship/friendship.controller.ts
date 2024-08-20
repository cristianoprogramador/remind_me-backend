import { Controller, Post, Body, Get, Param, Query } from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { GetUser } from "src/auth/get-user.decorator";

@ApiTags("Friendship")
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

  @Post("respond/:requestId")
  @ApiOperation({ summary: "Responder a uma solicitação de amizade" })
  async respondToFriendRequest(
    @GetUser() user: { userId: string },
    @Param("requestId") requestId: string,
    @Query("accept") accept: boolean
  ) {
    return this.friendshipService.respondToFriendRequest(
      user.userId,
      requestId,
      accept
    );
  }
}
