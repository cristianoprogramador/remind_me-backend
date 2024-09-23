// src\notifications\notifications.service.ts

import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import * as twilio from "twilio";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class NotificationService {
  private twilioClient;

  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkNotificationsAndSendMessages() {
    const now = new Date();
    const nowUtc = new Date(now.toISOString());
    const currentHourUtc = nowUtc.getUTCHours();
    const currentDateUtc = nowUtc.toISOString().slice(0, 10);

    const notifications = await this.prisma.notification.findMany({
      where: {
        enabled: true,
        OR: [
          { phoneNotify: true, phoneNumber: { not: null } },
          { emailNotify: true },
        ],
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // console.log(`[DEBUG] Notificações encontradas: ${notifications.length}`);

    for (const notification of notifications) {
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

      if (annotations.length > 0) {
        const annotationContents = annotations
          .map((annotation) => annotation.content)
          .join(", ");

        if (notification.phoneNotify && notification.phoneNumber) {
          await this.sendSMS(
            notification.phoneNumber,
            notification.user.name,
            annotationContents
          );
        }

        if (notification.emailNotify && notification.user.email) {
          await this.mailService.sendReminderEmail(
            notification.user.email,
            notification.user.name,
            annotationContents
          );
        }
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
      return null;
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
