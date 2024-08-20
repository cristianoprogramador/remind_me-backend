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

    // Solicitações recebidas
    const receivedRequests = await this.prisma.friendship.findMany({
      where: {
        user2Id: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        user1: true,
      },
    });

    // Solicitações enviadas
    const sentRequests = await this.prisma.friendship.findMany({
      where: {
        user1Id: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        user2: true,
      },
    });

    return {
      receivedRequests,
      sentRequests,
    };
  }

  async respondToFriendRequest(
    requestId: string,
    accept: boolean,
    userId: string
  ) {
    if (!isUUID(requestId)) {
      throw new BadRequestException("Invalid request ID");
    }

    const friendship = await this.prisma.friendship.findUnique({
      where: {
        uuid: requestId,
      },
    });

    if (!friendship) {
      throw new BadRequestException("Friendship request not found");
    }

    if (friendship.user2Id !== userId) {
      throw new BadRequestException("Unauthorized to respond to this request");
    }

    if (accept) {
      await this.prisma.friendship.update({
        where: {
          uuid: requestId,
        },
        data: {
          status: FriendshipStatus.ACCEPTED,
          updatedAt: new Date(),
        },
      });
    } else {
      await this.prisma.friendship.update({
        where: {
          uuid: requestId,
        },
        data: {
          status: FriendshipStatus.REJECTED,
          updatedAt: new Date(),
        },
      });
    }

    return {
      message: `Friendship request has been ${accept ? "accepted" : "rejected"}.`,
    };
  }

  async getFriends(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException("Invalid UUID");
    }

    return this.prisma.friendship.findMany({
      where: {
        OR: [
          {
            user1Id: userId,
            status: FriendshipStatus.ACCEPTED,
          },
          {
            user2Id: userId,
            status: FriendshipStatus.ACCEPTED,
          },
        ],
      },
      include: {
        user1: true,
        user2: true,
      },
    });
  }

  async searchUserByEmail(userEmail: string, requesterId: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: requesterId, user2Id: user.uuid },
          { user1Id: user.uuid, user2Id: requesterId },
        ],
      },
    });

    return {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      status: friendship ? friendship.status : null,
    };
  }
}
