import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import * as twilio from "twilio";

@Injectable()
export class NotificationService {
  private twilioClient;

  constructor(private prisma: PrismaService) {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkNotificationsAndSendSMS() {
    const now = new Date();
    const nowUtc = new Date(now.toISOString()); // Horário atual em UTC
    const currentHourUtc = nowUtc.getUTCHours();
    const currentDateUtc = nowUtc.toISOString().slice(0, 10);

    const notifications = await this.prisma.notification.findMany({
      where: {
        phoneNotify: true,
        enabled: true,
        phoneNumber: {
          not: null,
        },
      },
      include: {
        user: true,
      },
    });

    console.log(`[DEBUG] Notificações encontradas: ${notifications.length}`);

    for (const notification of notifications) {
      console.log(
        `[DEBUG] Verificando notificações para o usuário: ${notification.user.name} com o ID: ${notification.userId}`
      );

      // Converte o horário de Brasília para UTC para comparar corretamente
      const annotations = await this.prisma.annotation.findMany({
        where: {
          authorId: notification.userId,
          remindAt: {
            gte: new Date(`${currentDateUtc}T${currentHourUtc}:00:00.000Z`),
            lt: new Date(`${currentDateUtc}T${currentHourUtc + 1}:00:00.000Z`),
          },
        },
        select: {
          content: true,
          remindAt: true,
        },
      });

      console.log(
        `[DEBUG] Anotações encontradas para enviar SMS: ${annotations.length}`
      );

      for (const annotation of annotations) {
        console.log(
          `[DEBUG] Anotação encontrada com remindAt: ${annotation.remindAt} (horário UTC)`
        );
      }

      if (annotations.length > 0) {
        const annotationContents = annotations
          .map((annotation) => annotation.content)
          .join(", ");

        console.log(`[DEBUG] Conteúdo das anotações: ${annotationContents}`);

        await this.sendSMS(
          notification.phoneNumber,
          notification.user.name,
          annotationContents
        );
      } else {
        console.log(
          `[DEBUG] Nenhuma anotação para enviar SMS para o usuário ${notification.user.name}`
        );
      }
    }
  }

  private async sendSMS(
    phoneNumber: string,
    userName: string,
    annotationContents: string
  ) {
    try {
      await this.twilioClient.messages.create({
        body: `Olá ${userName}, aqui estão os seus lembretes: ${annotationContents}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
    } catch (error) {
      console.error(`Erro ao tentar enviar SMS para ${phoneNumber}:`, error);
    }
  }

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
