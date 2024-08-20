import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FriendshipStatus } from "@prisma/client";
import { isUUID } from "class-validator";

@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService) {}

  async sendFriendRequest(userId: string, friendEmail: string) {
    // Verifica se o e-mail do amigo existe
    const friend = await this.prisma.user.findUnique({
      where: { email: friendEmail },
    });

    if (!friend) {
      throw new NotFoundException("E-mail não cadastrado ou incorreto.");
    }

    // Verifica se já existe uma amizade ou um pedido pendente
    const existingFriendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: friend.uuid },
          { user1Id: friend.uuid, user2Id: userId },
        ],
      },
    });

    if (existingFriendship) {
      throw new ConflictException("Uma amizade já existe ou está pendente.");
    }

    // Cria a relação de amizade com status "PENDING"
    return this.prisma.friendship.create({
      data: {
        user1Id: userId,
        user2Id: friend.uuid,
        status: FriendshipStatus.PENDING,
      },
    });
  }

  async getFriendRequests(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException("Invalid UUID");
    }

    return this.prisma.friendship.findMany({
      where: {
        user2Id: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        user1: true,
      },
    });
  }

  async respondToFriendRequest(
    userId: string,
    requestId: string,
    accept: boolean
  ) {
    const friendship = await this.prisma.friendship.findUnique({
      where: { uuid: requestId },
      include: { user2: true },
    });

    if (!friendship || friendship.user2Id !== userId) {
      throw new NotFoundException("Pedido de amizade não encontrado.");
    }

    return this.prisma.friendship.update({
      where: { uuid: requestId },
      data: {
        status: accept ? FriendshipStatus.ACCEPTED : FriendshipStatus.REJECTED,
      },
    });
  }
}
