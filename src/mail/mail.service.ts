// src/mail/mail.service.ts
import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { reminderTemplate, recoverPasswordTemplate } from "./templates";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendReminderEmail(email: string, name: string, reminders: string) {
    const html = reminderTemplate(name, reminders);
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Seus Lembretes - Remind-Me",
        html,
      });
    } catch (error) {
      console.error(`Erro ao enviar e-mail para ${email}:`, error);
    }
  }

  async sendRecoverPasswordEmail(email: string, name: string, url: string) {
    const html = recoverPasswordTemplate(name, url);
    await this.mailerService.sendMail({
      to: email,
      subject: "Solicitação de Redefinição de Senha",
      html,
    });
  }
}
