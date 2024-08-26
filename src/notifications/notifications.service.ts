import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getNotificationSettings(userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { userId },
    });

    if (!notification) {
      throw new NotFoundException(
        "Configurações de notificação não encontradas."
      );
    }

    return notification;
  }

  async updateNotificationSettings(
    userId: string,
    updateNotificationDto: UpdateNotificationDto
  ) {
    return this.prisma.notification.updateMany({
      where: { userId },
      data: updateNotificationDto,
    });
  }

  async createNotificationSettings(
    userId: string,
    createNotificationDto: CreateNotificationDto
  ) {
    const existingNotification = await this.prisma.notification.findFirst({
      where: { userId },
    });

    if (existingNotification) {
      throw new ConflictException(
        "Configurações de notificação já existem para este usuário."
      );
    }

    return this.prisma.notification.create({
      data: {
        userId,
        ...createNotificationDto,
      },
    });
  }
}
