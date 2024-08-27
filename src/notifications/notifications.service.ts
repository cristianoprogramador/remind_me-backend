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
    // Inicializa o cliente Twilio
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  @Cron(CronExpression.EVERY_MINUTE) // Muda para rodar a cada minuto
  async checkNotificationsAndSendSMS() {
    console.log("Iniciando verificação de notificações...");

    // Obtenha a hora atual
    const now = new Date();

    // Encontre todas as notificações habilitadas com notificação por SMS
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

    console.log(`Total de notificações encontradas: ${notifications.length}`);

    if (notifications.length === 0) {
      console.log("Nenhuma notificação para processar.");
      return;
    }

    for (const notification of notifications) {
      // Busca as anotações que precisam ser lembradas agora (ou na próxima verificação)
      const annotations = await this.prisma.annotation.findMany({
        where: {
          authorId: notification.userId,
          remindAt: {
            gte: now, // Anotações para lembrar agora ou depois
            lt: new Date(now.getTime() + 60 * 1000), // Apenas lembretes nos próximos 60 segundos
          },
        },
        select: {
          content: true, // Obter apenas o conteúdo da anotação
        },
      });

      console.log(
        `Total de anotações futuras encontradas para o usuário ${notification.user.name}: ${annotations.length}`
      );

      if (annotations.length === 0) {
        console.log(
          `Nenhuma anotação futura para o usuário ${notification.user.name}.`
        );
        continue;
      }

      // Prepara o conteúdo das anotações para enviar no SMS
      const annotationContents = annotations
        .map((annotation) => annotation.content)
        .join(", ");

      // Verifica o conteúdo que será enviado
      console.log(
        `Preparando para enviar SMS para ${notification.phoneNumber}:`
      );
      console.log(`Conteúdo das anotações: ${annotationContents}`);

      // Chama a função de envio de SMS com as informações corretas
      await this.sendSMS(
        notification.phoneNumber,
        notification.user.name,
        annotationContents
      );
    }
  }

  private async sendSMS(
    phoneNumber: string,
    userName: string,
    annotationContents: string
  ) {
    try {
      console.log(
        `Tentando enviar SMS para ${phoneNumber} com o nome do usuário ${userName} e anotações: ${annotationContents}`
      );

      // Ative as linhas abaixo quando estiver pronto para enviar o SMS
      await this.twilioClient.messages.create({
        body: `Olá ${userName}, aqui estão os seus lembretes: ${annotationContents}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      console.log(`SMS enviado com sucesso para ${phoneNumber}`);
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
